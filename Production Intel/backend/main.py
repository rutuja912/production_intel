from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, SessionLocal, Base
from datetime import date
from sqlalchemy import func

Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for MVP only
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_best_machine_for_allocation(db: Session, required_hours: float):
    machines = db.query(models.Machine).all()
    logs = db.query(models.MachineLog).filter(
        models.MachineLog.log_date == date.today()
    ).all()

    best_machine = None
    max_remaining = -1

    usage = (
    db.query(
        models.MachineLog.machine_id,
        func.sum(models.MachineLog.actual_hours).label("used")
    )
    .filter(models.MachineLog.log_date == date.today())
    .group_by(models.MachineLog.machine_id)
    .all()
    )

    usage_map = {u.machine_id: u.used for u in usage}
    for machine in machines:
        today_logged = usage_map.get(machine.id, 0)

        remaining_capacity = machine.max_hours - today_logged

        if remaining_capacity >= required_hours and remaining_capacity > max_remaining:
            max_remaining = remaining_capacity
            best_machine = machine

    return best_machine


@app.get("/machines")
def read_machines(db: Session = Depends(get_db)):
    machines = db.query(models.Machine).all()
    # logs = db.query(models.MachineLog).all()
    logs = db.query(models.MachineLog).filter(
    models.MachineLog.log_date == date.today()
).all()

    today = date.today()

    result = []

    for machine in machines:
        # Sum only today's logs
        today_logged = sum(
            l.actual_hours
            for l in logs
            if l.machine_id == machine.id and l.log_date == today
        )

        utilization = (
            (today_logged / machine.max_hours) * 100
            if machine.max_hours > 0 else 0
        )

        result.append({
            "id": machine.id,
            "name": machine.name,
            "max_hours": machine.max_hours,
            "today_logged_hours": round(today_logged, 2),
            "utilization_percent": round(utilization, 2)
        })

    return result


@app.get("/inventory")
def read_inventory(db: Session = Depends(get_db)):
    return crud.get_inventory(db)


# @app.get("/work-orders")
# def read_work_orders(db: Session = Depends(get_db)):
    # orders = db.query(models.WorkOrder).all()
    # logs = db.query(models.MachineLog).all()
    # machines = db.query(models.Machine).all()

    # today = date.today()

    # result = []

    # for order in orders:
    #     machine = next((m for m in machines if m.id == order.machine_id), None)

    #     total_logged = sum(
    #         l.actual_hours
    #         for l in logs
    #         if l.work_order_id == order.id
    #     )

    #     remaining_hours = max(order.estimated_hours - total_logged, 0)

    #     remaining_days = (
    #         (order.planned_end_date - today).days
    #         if order.planned_end_date else 0
    #     )

    #     required_daily = (
    #         remaining_hours / remaining_days
    #         if remaining_days > 0 else remaining_hours
    #     )

    #     machine_capacity = machine.max_hours if machine else 0

    #     risk = required_daily > machine_capacity

    #     result.append({
    #         "id": order.id,
    #         "client_name": order.client_name,
    #         "product_name": order.product_name,
    #         "estimated_hours": order.estimated_hours,
    #         "logged_hours": round(total_logged, 2),
    #         "remaining_hours": round(remaining_hours, 2),
    #         "remaining_days": remaining_days,
    #         "required_daily_hours": round(required_daily, 2),
    #         "machine_name": machine.name if machine else "N/A",
    #         "machine_capacity": machine_capacity,
    #         "risk": risk,
    #     })

    # return result


@app.post("/machine-logs")
def create_machine_log(log: schemas.MachineLogCreate, db: Session = Depends(get_db)):
    return crud.create_machine_log(db, log)


@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    machines = db.query(models.Machine).all()
    # logs = db.query(models.MachineLog).all()
    logs = db.query(models.MachineLog).filter(
    models.MachineLog.log_date == date.today()
    ).all()

    today = date.today()

    machine_summary = []
    overloaded = []
    idle = []

    total_capacity = sum(m.max_hours for m in machines)
    total_logged_today = 0

    for machine in machines:
        today_logged = sum(
            l.actual_hours
            for l in logs
            if l.machine_id == machine.id and l.log_date == today
        )

        total_logged_today += today_logged

        utilization_percent = (
            (today_logged / machine.max_hours) * 100
            if machine.max_hours > 0 else 0
        )

        status = "Optimal"

        if utilization_percent > 90:
            status = "Overloaded"
            overloaded.append(machine.name)

        elif utilization_percent < 30:
            status = "Idle"
            idle.append(machine.name)

        machine_summary.append({
            "machine_id": machine.id,
            "machine_name": machine.name,
            "capacity": machine.max_hours,
            "today_logged": round(today_logged, 2),
            "utilization_percent": round(utilization_percent, 2),
            "status": status
        })

    capacity_gap = round(total_capacity - total_logged_today, 2)

    overall_utilization = (
        (total_logged_today / total_capacity) * 100
        if total_capacity > 0 else 0
    )

    return {
        "overall_utilization": round(overall_utilization, 2),
        "capacity_gap": capacity_gap,
        "overloaded_machines": overloaded,
        "idle_machines": idle,
        "machine_summary": machine_summary
    }


@app.get("/work-orders")
def read_work_orders(db: Session = Depends(get_db)):
    orders = db.query(models.WorkOrder).all()
    # logs = db.query(models.MachineLog).all()
    logs = db.query(models.MachineLog).filter(
    models.MachineLog.log_date == date.today()).all()
    machines = db.query(models.Machine).all()

    today = date.today()
    result = []

    for order in orders:
        machine = next((m for m in machines if m.id == order.machine_id), None)

        total_logged = sum(
            l.actual_hours
            for l in logs
            if l.work_order_id == order.id
        )

        remaining_hours = max(order.estimated_hours - total_logged, 0)

        remaining_days = (
            (order.planned_end_date - today).days
            if order.planned_end_date else 0
        )

        required_daily = (
            remaining_hours / remaining_days
            if remaining_days > 0 else remaining_hours
        )

        machine_capacity = machine.max_hours if machine else 0

        risk = required_daily > machine_capacity

        result.append({
            "id": order.id,
            "client_name": order.client_name,
            "product_name": order.product_name,
            "estimated_hours": order.estimated_hours,
            "logged_hours": round(total_logged, 2),
            "remaining_hours": round(remaining_hours, 2),
            "remaining_days": remaining_days,
            "required_daily_hours": round(required_daily, 2),
            "machine_name": machine.name if machine else "N/A",
            "machine_capacity": machine_capacity,
            "risk": risk,
        })

    return result


@app.post("/work-orders")
def create_work_order(order: schemas.WorkOrderCreate, db: Session = Depends(get_db)):

    today = date.today()

    remaining_days = (order.planned_end_date - today).days if order.planned_end_date else 1
    remaining_days = max(remaining_days, 1)

    required_daily = order.estimated_hours / remaining_days

    best_machine = get_best_machine_for_allocation(db, required_daily)

    if not best_machine:
        return {"error": "No machine has sufficient remaining capacity today"}

    order.machine_id = best_machine.id

    return crud.create_work_order(db, order)


# @app.get("/dashboard")
# def dashboard(db: Session = Depends(get_db)):
    # machines = db.query(models.Machine).all()
    # orders = db.query(models.WorkOrder).all()
    # logs = db.query(models.MachineLog).all()

    # # ----- Machine Utilization -----
    # total_capacity = sum(m.max_hours for m in machines)
    # total_actual = sum(log.actual_hours for log in logs)

    # utilization = (total_actual / total_capacity * 100) if total_capacity else 0

    # risk_orders = []
    # recommendations = []

    # # ----- Order Risk Calculation -----
    # for order in orders:
    #     total_logged = sum(
    #         log.actual_hours
    #         for log in logs
    #         if log.work_order_id == order.id
    #     )

    #     remaining_hours = order.estimated_hours - total_logged

    #     remaining_days = (order.planned_end_date - date.today()).days

    #     if remaining_days > 0:
    #         required_per_day = remaining_hours / remaining_days

    #         # Simple rule: assume 8 hr/day capacity
    #         if required_per_day > 8:
    #             risk_orders.append(order.id)
    #             recommendations.append(
    #                 f"Order {order.id} is at risk. Needs {round(required_per_day,2)} hrs/day."
    #             )

    # return {
    #     "utilization": round(utilization, 2),
    #     "orders_at_risk": risk_orders,
    #     "recommendations": recommendations,
    # }

@app.get("/machine-logs")
def read_logs(db: Session = Depends(get_db)):
    return crud.get_machine_logs(db)
