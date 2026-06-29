from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import enum


class Base(DeclarativeBase):
    pass


class Platform(str, enum.Enum):
    META = "meta"
    GOOGLE = "google"


class HealthStatus(str, enum.Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    platform: Mapped[Platform] = mapped_column(Enum(Platform))
    name: Mapped[str] = mapped_column(String)
    account_id: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    daily_budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    synced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    creatives: Mapped[list["Creative"]] = relationship(back_populates="campaign")


class Creative(Base):
    __tablename__ = "creatives"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    campaign_id: Mapped[str] = mapped_column(ForeignKey("campaigns.id"))
    platform: Mapped[Platform] = mapped_column(Enum(Platform))
    name: Mapped[str] = mapped_column(String)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    headline: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String)
    health_score: Mapped[float] = mapped_column(Float, default=100.0)
    health_status: Mapped[HealthStatus] = mapped_column(Enum(HealthStatus), default=HealthStatus.HEALTHY)
    synced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    campaign: Mapped["Campaign"] = relationship(back_populates="creatives")
    metrics: Mapped[list["CreativeMetric"]] = relationship(back_populates="creative")
    alerts: Mapped[list["Alert"]] = relationship(back_populates="creative")
    variants: Mapped[list["CreativeVariant"]] = relationship(back_populates="creative")


class CreativeMetric(Base):
    __tablename__ = "creative_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    creative_id: Mapped[str] = mapped_column(ForeignKey("creatives.id"))
    date: Mapped[datetime] = mapped_column(DateTime)
    impressions: Mapped[int] = mapped_column(Integer, default=0)
    clicks: Mapped[int] = mapped_column(Integer, default=0)
    spend: Mapped[float] = mapped_column(Float, default=0.0)
    conversions: Mapped[int] = mapped_column(Integer, default=0)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    frequency: Mapped[float] = mapped_column(Float, default=0.0)
    ctr: Mapped[float] = mapped_column(Float, default=0.0)
    cpm: Mapped[float] = mapped_column(Float, default=0.0)
    roas: Mapped[float] = mapped_column(Float, default=0.0)

    creative: Mapped["Creative"] = relationship(back_populates="metrics")


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    creative_id: Mapped[str] = mapped_column(ForeignKey("creatives.id"))
    signal: Mapped[str] = mapped_column(String)
    severity: Mapped[HealthStatus] = mapped_column(Enum(HealthStatus))
    value: Mapped[float] = mapped_column(Float)
    threshold: Mapped[float] = mapped_column(Float)
    dismissed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    creative: Mapped["Creative"] = relationship(back_populates="alerts")


class CreativeVariant(Base):
    __tablename__ = "creative_variants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    creative_id: Mapped[str] = mapped_column(ForeignKey("creatives.id"))
    headline: Mapped[str] = mapped_column(Text)
    body: Mapped[str] = mapped_column(Text)
    rationale: Mapped[str] = mapped_column(Text)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    creative: Mapped["Creative"] = relationship(back_populates="variants")
