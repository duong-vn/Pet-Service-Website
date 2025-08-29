import { Switch } from "@/components/ui/switch";
import React from "react";

const PermissionRow = React.memo(
  ({
    isChecked,
    p,
    onToogle,
  }: {
    isChecked: boolean;
    p: any;
    onToogle: (e: boolean, _id: string) => void;
  }) => {
    return (
      <label
        key={p._id}
        className="flex items-center justify-between rounded-lg border px-3 py-2"
        title={p.key}
      >
        <div className="min-w-0 pr-3">
          <div className="truncate text-sm font-medium">{p.name}</div>
          <div className="truncate text-xs text-muted-foreground">{p.key}</div>
        </div>

        <Switch
          checked={isChecked}
          onCheckedChange={(e) => onToogle(e, p._id)}
        />
      </label>
    );
  }
);
export default PermissionRow;
