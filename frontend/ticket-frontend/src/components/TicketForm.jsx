function TicketForm({
                        title,
                        setTitle,
                        description,
                        setDescription,
                        priority,
                        setPriority,
                        categoryId,
                        setCategoryId,
                        categories,
                        onSubmit
                    }) {
    return (
        <form onSubmit={onSubmit}>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Új ticket
            </h2>

            <div className="space-y-3">
                <input
                    placeholder="Cím"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <textarea
                    placeholder="Leírás"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                    <option value={4}>Critical</option>
                </select>

                <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                    <option value="">Válassz kategóriát</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                    Létrehozás
                </button>
            </div>
        </form>
    );
}

export default TicketForm;