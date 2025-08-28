type Role = {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: { _id: string; key: string }[];
  createdAt: string;
  updatedAt: string;
};

export default function RolesList({ roles }: { roles: Role[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <div
          key={role._id}
          className="rounded-xl border bg-background p-5 shadow-sm flex flex-col gap-2"
        >
          {" "}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{role.name}</h2>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                role.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {role.isActive ? "Hoạt động" : "Ngưng"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {role.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {role.permissions.map((p) => (
              <span
                key={p._id}
                className="bg-primary-light/10 dark:bg-primary-dark/20 text-xs px-2 py-1 rounded border border-primary-light dark:border-primary-dark"
              >
                {p.key}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Tạo: {new Date(role.createdAt).toLocaleDateString()} | Cập nhật:{" "}
            {new Date(role.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
