import { useEffect, useState } from "react";
import TicketCard from "./components/TicketCard";
import TicketForm from "./components/TicketForm";

const API_BASE = import.meta.env.VITE_API_URL;

function App() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [categoryId, setCategoryId] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadTickets();
    loadCategories();
  }, []);

  function loadTickets() {
    fetch(`${API_BASE}/api/Tickets`)
        .then(res => res.json())
        .then(data => setTickets(data))
        .catch(err => console.error(err));
  }

  function loadCategories() {
    fetch(`${API_BASE}/api/Categories`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error(err));
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${API_BASE}/Tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        priority: Number(priority),
        categoryId: Number(categoryId)
      })
    })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => {
          setTitle("");
          setDescription("");
          setPriority(1);
          setCategoryId("");
          loadTickets();
        })
        .catch(() => alert("Hiba történt létrehozáskor."));
  }

  function handleDelete(id) {
    if (!window.confirm("Biztos törlöd?")) return;

    fetch(`${API_BASE}/Tickets/${id}`, {
      method: "DELETE"
    })
        .then(res => {
          if (!res.ok) throw new Error();
          loadTickets();
        })
        .catch(() => alert("Hiba törlés közben."));
  }

  function handleNextStatus(id) {
    fetch(`${API_BASE}/Tickets/${id}/status`, {
      method: "PUT"
    })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => loadTickets())
        .catch(() => alert("Hiba státusz váltáskor."));
  }

  const filteredTickets = tickets.filter(ticket => {
    const statusMatches =
        statusFilter === "all" || ticket.status === Number(statusFilter);

    const priorityMatches =
        priorityFilter === "all" || ticket.priority === Number(priorityFilter);

    const categoryMatches =
        categoryFilter === "all" || ticket.categoryId === Number(categoryFilter);

    const searchMatches =
        searchText.trim() === "" ||
        ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchText.toLowerCase());

    return statusMatches && priorityMatches && categoryMatches && searchMatches;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "priorityDesc":
        return b.priority - a.priority;
      case "priorityAsc":
        return a.priority - b.priority;
      case "titleAsc":
        return a.title.localeCompare(b.title, "hu");
      case "titleDesc":
        return b.title.localeCompare(a.title, "hu");
      default:
        return 0;
    }
  });

  return (
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              🎫 Ticket kezelő
            </h1>
            <p className="mt-2 text-slate-600">
              React + ASP.NET ticket rendszer szűréssel, rendezéssel és kereséssel
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <TicketForm
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    priority={priority}
                    setPriority={setPriority}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    categories={categories}
                    onSubmit={handleSubmit}
                />
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">
                  Szűrés, rendezés, keresés
                </h2>

                <div className="space-y-3">
                  <input
                      type="text"
                      placeholder="Keresés cím vagy leírás alapján..."
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                  <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">Összes státusz</option>
                    <option value="1">Open</option>
                    <option value="2">In Progress</option>
                    <option value="3">Resolved</option>
                    <option value="4">Closed</option>
                  </select>

                  <select
                      value={priorityFilter}
                      onChange={e => setPriorityFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">Összes prioritás</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                    <option value="4">Critical</option>
                  </select>

                  <select
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="all">Összes kategória</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                    ))}
                  </select>

                  <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="newest">Legújabb elöl</option>
                    <option value="oldest">Legrégebbi elöl</option>
                    <option value="priorityDesc">Legmagasabb prioritás elöl</option>
                    <option value="priorityAsc">Legalacsonyabb prioritás elöl</option>
                    <option value="titleAsc">Cím szerint A-Z</option>
                    <option value="titleDesc">Cím szerint Z-A</option>
                  </select>

                  <button
                      onClick={() => {
                        setStatusFilter("all");
                        setPriorityFilter("all");
                        setCategoryFilter("all");
                        setSortBy("newest");
                        setSearchText("");
                      }}
                      className="w-full rounded-xl bg-slate-700 px-4 py-2 font-medium text-white transition hover:bg-slate-800"
                  >
                    Szűrők és rendezés törlése
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              {sortedTickets.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-slate-500">Nincs a keresésnek vagy szűrésnek megfelelő ticket.</p>
                  </div>
              ) : (
                  sortedTickets.map(ticket => (
                      <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onDelete={handleDelete}
                          onNextStatus={handleNextStatus}
                          formatStatus={formatStatus}
                          formatPriority={formatPriority}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                      />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

function formatStatus(status) {
  switch (status) {
    case 1: return "Open";
    case 2: return "In Progress";
    case 3: return "Resolved";
    case 4: return "Closed";
    default: return status;
  }
}

function formatPriority(priority) {
  switch (priority) {
    case 1: return "Low";
    case 2: return "Medium";
    case 3: return "High";
    case 4: return "Critical";
    default: return priority;
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 1: return "bg-emerald-500";
    case 2: return "bg-amber-500";
    case 3: return "bg-red-500";
    case 4: return "bg-violet-500";
    default: return "bg-slate-500";
  }
}

function getStatusColor(status) {
  switch (status) {
    case 1: return "bg-blue-500";
    case 2: return "bg-amber-500";
    case 3: return "bg-emerald-500";
    case 4: return "bg-slate-500";
    default: return "bg-slate-500";
  }
}

export default App;
