import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string };

type Props = {
  id?: string;
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  options?: Option[];
};

const DEFAULT_BUILDING_TYPES: Option[] = [
  "Arch Buildings",
  "Warehouses",
  "Aviation",
  "Commercial",
  "Carports",
  "Sales Storage",
  "Workshops",
  "Barndominiums",
  "Agricultural",
  "Garages",
].map((type) => ({ value: type, label: type }));

export default function BuildingTypeSelector({
  id,
  value,
  onChange,
  className,
  triggerClassName,
  placeholder = "Select an option",
  options,
}: Props) {
  const opts = options && options.length ? options : DEFAULT_BUILDING_TYPES;
  const selectedValue = value && value !== "all" ? value : undefined;

  return (
    <div id={id} className={className}>
      <Select value={selectedValue} onValueChange={onChange}>
        <SelectTrigger id={id} className={triggerClassName ?? "w-full"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Building Types</SelectItem>
          {opts.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
