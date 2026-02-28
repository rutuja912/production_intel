from sqlalchemy.orm import Session
import models

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