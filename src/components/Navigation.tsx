interface NavigationProps {
  activeForm: string;
  setActiveForm: (form: string) => void;
}

const Navigation = ({ activeForm, setActiveForm }: NavigationProps) => {
  const navItems = [
    { id: "author", label: "👤 Add Author" },
    { id: "book", label: "📖 Add Book" },
    { id: "publisher", label: "🏢 Add Publisher" },
    { id: "staff", label: "👨‍💼 Add Staff" },
    { id: "reader", label: "👥 Add Reader" },
    { id: "issue", label: "📋 Issue Book" },
    { id: "return", label: "↩️ Return Book" },
    { id: "books-view", label: "📚 View Books" },
    { id: "issues-view", label: "📋 View Issues" },
  ];

  return (
    <nav className="library-card mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveForm(item.id)}
            className={`library-nav-item ${activeForm === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
