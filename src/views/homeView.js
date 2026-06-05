import Sidebar from "@/components/Sidebar";
import { getSession } from "@/utils";
import { homeController } from "@/controllers/home.controller";
import { navigateTo } from "@/router/router";
import ReservationCard from "@/components/ReservationCard";
import { createReservation } from "@/services/reservation.service";

export default function homeView() {
  const user = getSession();
  if (!user) {
    navigateTo("/");
    return "";
  }

  setTimeout(() => {
    homeController();

    document
      .querySelector("#manageReservationsBtn")
      ?.addEventListener("click", (e) => {
        e?.preventDefault?.();
        console.log("manageReservationsBtn clicked", { user });
        navigateTo("/reservations");
      });

    document
      .querySelector("#newReservationBtn")
      ?.addEventListener("click", async (e) => {
        e?.preventDefault?.();
        console.log("newReservationBtn clicked", { user });
        const container = document.querySelector("#reservationsContainer");

        const newRes = {
          userId: user.id,
          workspace: "Sala Nueva",
          date: new Date().toISOString().slice(0, 10),
          startHour: "09:00",
          endHour: "10:00",
          reason: "Reserva rápida",
          status: "pending",
        };

        try {
          console.log("creating reservation", newRes);
          const created = await createReservation(newRes);
          console.log("created reservation", created);
          container.insertAdjacentHTML("afterbegin", ReservationCard(created));
        } catch (err) {
          console.error(err);
          // Fallback: render locally if API fails
          container.insertAdjacentHTML("afterbegin", ReservationCard(newRes));
        }
      });
  });

  return `
    <div class="flex">

      ${Sidebar()}

      <main class="flex-1 p bg-slate-100 min-h-screen">

        <div class="">

          <h1 class="text-sm font-bold">
            Bienvenido ${user?.name}
          </h1>

          <p class="text-orange-900">
            Rol: ${user?.role}
          </p>

        </div>

        ${user?.role === "admin"
      ? `
              <section
                class="bg-white p-5 rounded-lg shadow mb-6"
              >
                <h2 class="font-bold text-xl mb-2">
                  Panel Administrador
                </h2>

                <p>
                  Puedes visualizar todas las reservas.
                </p>

                <button
                  type="button"
                  id="manageReservationsBtn"
                  class="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Gestionar Reservas
                </button>

              </section>
            `
      : `
              <section
                class="bg-white p-5"
              >
                <h2 class="font-bold text-xl mb-2">
                  Panel Usuario
                </h2>

                <p>
                  Puedes visualizar únicamente tus reservas.
                </p>

                <button
                  type="button"
                  id="newReservationBtn"
                  class="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Nueva Reserva
                </button>

              </section>
            `
    }

        <section
          class="bg-white p-5 rounded-lg shadow"
        >

          <div
            class="flex justify-between items-center mb-4"
          >
            <h2 class="font-bold text-xl">
              Reservas
            </h2>

            <span
              class="text-sm text-slate-500"
            >
              ${user?.role === "admin"
      ? "Mostrando todas las reservas"
      : "Mostrando únicamente tus reservas"
    }
            </span>
          </div>

          <div
            id="reservationsContainer"
            class="grid gap-4 md:grid-cols-2"
          >
            <div class="w-full text-center py-8 col-span-2">
              <p class="text-emerald-800">
                Cargando reservas ...
              </p>
            </div>
          </div>

        </section>

      </main>

    </div>
  `;
}