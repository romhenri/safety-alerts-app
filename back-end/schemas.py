from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

GuardStatusAll = Literal["pending", "going", "not_going", "canceled", "solved"]


class IncidentCreate(BaseModel):
    tipo: str = Field(..., min_length=1, max_length=64)
    descricao: str | None = Field(None, max_length=2000)
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    guard_status: GuardStatusAll = "pending"


class IncidentRead(BaseModel):
    id: int
    tipo: str
    descricao: str | None
    lat: float
    lng: float
    timestamp: datetime
    guard_status: str

    model_config = {"from_attributes": True}


class GuardConfirm(BaseModel):
    status: GuardStatusAll
