from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Incident
from schemas import GuardConfirm, IncidentCreate, IncidentRead

app = FastAPI(title="UniShield API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def migrate_sqlite():
    with engine.begin() as conn:
        r = conn.execute(text("PRAGMA table_info(incidents)"))
        cols = {row[1] for row in r}
        if "guard_status" not in cols:
            conn.execute(
                text(
                    "ALTER TABLE incidents ADD COLUMN guard_status VARCHAR(20) DEFAULT 'pending'"
                )
            )


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    migrate_sqlite()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/incidents", response_model=list[IncidentRead])
def list_incidents(db: Session = Depends(get_db)):
    stmt = select(Incident).order_by(Incident.timestamp.desc())
    rows = db.execute(stmt).scalars().all()
    return rows


@app.post("/incidents", response_model=IncidentRead, status_code=201)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    row = Incident(
        tipo=payload.tipo.strip(),
        descricao=payload.descricao.strip() if payload.descricao else None,
        lat=payload.lat,
        lng=payload.lng,
        guard_status="pending",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@app.patch("/incidents/{incident_id}/guard", response_model=IncidentRead)
def guard_confirm(
    incident_id: int,
    payload: GuardConfirm,
    db: Session = Depends(get_db),
):
    row = db.get(Incident, incident_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Incidente não encontrado")
    row.guard_status = payload.status
    db.commit()
    db.refresh(row)
    return row


@app.delete("/incidents/{incident_id}", status_code=204)
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    row = db.get(Incident, incident_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Incidente não encontrado")
    db.delete(row)
    db.commit()
