def update_daily_hourly(sender, instance, created, **kwargs):
    from consumptions.models import DailyConsumption, HourlyConsumption

    created_at = instance.created_at

    daily_consumption, _ = DailyConsumption.objects.get_or_create(
        date=created_at.date(),
        student=instance.student
    )
    daily_consumption.total_cost += instance.cost
    daily_consumption.save()

    hourly_consumption, _s = HourlyConsumption.objects.get_or_create(
        date=created_at.date(),
        hour=created_at.hour,
        student=instance.student
    )
    hourly_consumption.total_cost += instance.cost
    hourly_consumption.save()
