from pydantic import BaseModel,Optional
from datetime import date


class MachineCreate(BaseModel):
    name: str
    max_hours: float
    actual_hours: float
    downtime: float


class InventoryCreate(BaseModel):
    product: str
    qty: int
    days_in_store: int


class WorkOrderCreate(BaseModel):
    client_name: str
    product_name: str
    estimated_hours: float
    planned_end_date: date
    machine_id: Optional[int] = None

class MachineLogCreate(BaseModel):
    machine_id: int
    work_order_id: int
    log_date: date
    actual_hours: float
    downtime: float