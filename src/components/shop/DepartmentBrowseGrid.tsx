import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { STORE_DEPARTMENTS } from "@/lib/catalog-departments";

export function DepartmentBrowseGrid() {
  const navigate = useNavigate();

  return (
    <section className="border-b border-border bg-background py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-navira-navy dark:text-foreground md:text-3xl">
            Shop by department
          </h2>
          <p className="mt-2 text-muted-foreground">
            Walk our aisles — browse typical items and stock in each department
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STORE_DEPARTMENTS.map((dept) => (
            <Card
              key={dept.id}
              className="group cursor-pointer overflow-hidden border-border transition-all hover:border-navira-red/40 hover:shadow-md"
              onClick={() => navigate(`/shop/department/${dept.id}`)}
            >
              <img
                src={dept.image}
                alt={dept.name}
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <CardContent className="p-5">
                <h3 className="font-semibold group-hover:text-navira-red">{dept.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
