export default function Table({ children }) {
    return (<div className="overflow-x-auto my-4 rounded-lg border">
      <table className="w-full text-body">{children}</table>
    </div>);
}
