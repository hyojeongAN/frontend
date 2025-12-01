export default function DashboardCards() {
    return (
        <div className="dashboard-cards">
            <div className="card">{errorsToday} Errors Today</div>
            <div className="card">{resolvedErrors} Resolved Errors</div>
            <div className="card">{criticalRate}% Critical Errors Rate</div>
        </div>
    );
}