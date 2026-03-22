import Badge from "./Badge";

function TicketCard({
                        ticket,
                        onDelete,
                        onNextStatus,
                        formatStatus,
                        formatPriority,
                        getStatusColor,
                        getPriorityColor
                    }) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold text-slate-900">
                        {ticket.title}
                    </h3>
                    <p className="text-slate-600">
                        {ticket.description}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onNextStatus(ticket.id)}
                        disabled={ticket.status === 4}
                        className={`rounded-xl px-4 py-2 font-medium text-white transition ${
                            ticket.status === 4
                                ? "cursor-not-allowed bg-slate-400"
                                : "bg-amber-500 hover:bg-amber-600"
                        }`}
                    >
                        Következő státusz
                    </button>

                    <button
                        onClick={() => onDelete(ticket.id)}
                        className="rounded-xl bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                    >
                        Törlés
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                    text={`Státusz: ${formatStatus(ticket.status)}`}
                    color={getStatusColor(ticket.status)}
                />
                <Badge
                    text={`Prioritás: ${formatPriority(ticket.priority)}`}
                    color={getPriorityColor(ticket.priority)}
                />
                <Badge
                    text={`Kategória: ${ticket.categoryName}`}
                    color="bg-slate-500"
                />
            </div>
        </div>
    );
}

export default TicketCard;