import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCustomersQuery } from "@/redux/api/projectApi";

type Props = {
  id?: string;
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
};

export default function CustomerSelector({
  id,
  value,
  onChange,
  className,
  triggerClassName,
  placeholder = "Select Customer",
}: Props) {
  const { data } = useGetCustomersQuery({ limit: 100 });
  const customers = data?.customers ?? [];

  const selectedValue = value && value !== "all" ? value : undefined;

  return (
    <div id={id} className={className}>
      <Select value={selectedValue} onValueChange={onChange}>
        <SelectTrigger id={id} className={triggerClassName ?? "w-full"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Select Customer</SelectItem>
          {customers.map((c) => {
            const fullName = `${c.firstName} ${c.lastName}`.trim();
            return (
              <SelectItem key={c._id} value={fullName}>
                {fullName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
