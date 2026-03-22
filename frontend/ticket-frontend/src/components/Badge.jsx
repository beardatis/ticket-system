function Badge({ text, color }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${color}`}
        >
      {text}
    </span>
    );
}

export default Badge;