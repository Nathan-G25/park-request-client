import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AuditLog } from "@/types";
import { FileText, Search, Shield, User } from "lucide-react";
import { useMemo, useState } from "react";

const logs: AuditLog[] = [
  {
    id: "LOG-001",
    action: "Provider approved",
    actorType: "admin",
    target: "CityPark Solutions",
    category: "provider",
    timestamp: "2024-03-15 14:32:18",
  },
  {
    id: "LOG-003",
    action: "Warden access disabled",
    actorType: "admin",
    target: "W-1006 (Lisa Anderson)",
    category: "warden",
    timestamp: "2024-03-15 12:20:45",
  },
  {
    id: "LOG-005",
    action: "Provider suspended",
    actorType: "admin",
    target: "ParkEasy Ltd",
    category: "provider",
    timestamp: "2024-03-14 16:42:11",
  },
  {
    id: "LOG-006",
    action: "Admin login",
    actorType: "admin",
    target: "Auth System",
    category: "auth",
    timestamp: "2024-03-14 09:15:33",
  },
  {
    id: "LOG-006",
    action: "Provider login",
    actorType: "provider",
    target: "Auth System",
    category: "auth",
    timestamp: "2024-03-14 09:15:33",
  },
];

const getCategoryIcon = (category: AuditLog["category"]) => {
  switch (category) {
    case "auth":
      return User;
    case "provider":
      return FileText;
    case "warden":
      return Shield;
  }
};

const getCategoryBadge = (category: AuditLog["category"]) => {
  switch (category) {
    case "auth":
      return (
        <Badge variant="outline" className="text-chart-4 border-chart-4/30">
          Auth
        </Badge>
      );
    case "provider":
      return (
        <Badge variant="outline" className="text-blue-500 border-blue-500/30">
          Provider
        </Badge>
      );
    case "warden":
      return (
        <Badge variant="outline" className="text-green-500 border-success/30">
          Warden
        </Badge>
      );
  }
};

const getActorBadge = (actorType: AuditLog["actorType"]) => {
  switch (actorType) {
    case "admin":
      return (
        <Badge className="bg-blue-100 text-blue-500 border-0">Admin</Badge>
      );
    case "provider":
      return (
        <Badge className="bg-teal-100 text-teal-500 border-0">Provider</Badge>
      );
    case "warden":
      return (
        <Badge className="bg-warning/10 text-warning border-0">Warden</Badge>
      );
  }
};

type FilterValue = "All" | "auth" | "provider" | "warden";
// type ActorFilter = "All" | "admin" | "provider" | "warden";

const AuditLogs = () => {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.target.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategorySelect =
        filter === "All" || l.category.toLowerCase() === filter.toLowerCase();

      //   const matchesActorSelect =
      //     filterActor === "All" ||
      //     l.actorType.toLowerCase() === filterActor.toLowerCase();

      return matchesSearch && matchesCategorySelect;
    });
  }, [searchTerm, filter]);

  return (
    <main className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">Audit Logs</h1>
        <p className=" tracking-wide text-sm">
          Immutable record of all system actions
        </p>
      </header>
      <section className=" mt-10">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-10"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            defaultValue="All"
            onValueChange={(v) => setFilter(v as FilterValue)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="auth">Auth</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="warden">Warden</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actors</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="warden">Warden</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md shadow-sm divide-y divide-border pt-5">
          {filteredLogs.map((log) => {
            const Icon = getCategoryIcon(log.category);
            return (
              <div
                key={log.id}
                className="p-4 hover:bg-muted/30 transition-colors "
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{log.action}</p>
                      {getCategoryBadge(log.category)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <div>{getActorBadge(log.actorType)}</div>
                      <span>Target: {log.target}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground font-mono">
                      {log.id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page 1 of 50</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuditLogs;
