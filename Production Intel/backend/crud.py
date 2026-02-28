from sqlalchemy.orm import Session
import models
from sqlalchemy import func
from datetime import date

def get_machines(db: Session):
    return db.query(models.Machine).all()

def create_machine(db: Session, machine):
    db_machine = models.Machine(**machine.dict())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine


def get_inventory(db: Session):
    return db.query(models.Inventory).all()

def create_work_order(db: Session, order):
    db_order = models.WorkOrder(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def create_machine_log(db: Session, log):
    db_log = models.MachineLog(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_work_orders(db):
    return db.query(models.WorkOrder).all()

def create_work_order(db, order):
    db_order = models.WorkOrder(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_machine_logs(db):
    return db.query(models.MachineLog).all()

SHIFT_HOURS = 8

def get_underutilized_machine(db: Session):
    results = (
        db.query(
            models.MachineLog.machine_id,
            func.sum(models.MachineLog.actual_hours).label("total_work")
        )
        .filter(models.MachineLog.log_date == date.today())
        .group_by(models.MachineLog.machine_id)
        .all()
    )

    machine_capacity = {}

    for r in results:
        remaining = SHIFT_HOURS - (r.total_work or 0)
        machine_capacity[r.machine_id] = remaining

    # Machine with highest remaining capacity
    return max(machine_capacity, key=machine_capacity.get)