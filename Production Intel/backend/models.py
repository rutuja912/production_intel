from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship

class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String)
    product_name = Column(String)
    estimated_hours = Column(Float)
    planned_end_date = Column(Date)
    machine_id = Column(Integer, ForeignKey("machines.id"))

class MachineLog(Base):
    __tablename__ = "machine_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"))
    work_order_id = Column(Integer, ForeignKey("work_orders.id"))
    log_date = Column(Date)
    actual_hours = Column(Float)
    downtime = Column(Float)

class Machine(Base):
    __tablename__ = "machines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    max_hours = Column(Float)
    actual_hours = Column(Float)
    downtime = Column(Float)


class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    qty = Column(Integer)
    days_in_store = Column(Integer)


