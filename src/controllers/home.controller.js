import ReservationCard from "@components/ReservationCard";
import { getReservations, updateReservation, deleteReservation } from "@services/reservation.service";
import { getSession } from "@/utils";

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");

  const user = getSession();

  const reservations = await getReservations();

  const filteredReservations =
    user.role === "admin"
      ? reservations
      : reservations.filter((reservation) => reservation.userId === user.id);

  container.innerHTML = container.innerHTML = filteredReservations?.length
    ? filteredReservations
      .map((reservation) => ReservationCard(reservation))
      .join("")
    : `
      <div class="w-full text-center py-8 col-span-2">
        <p class="text-slate-500">
          No hay reservas disponibles
        </p>
      </div>
    `;

  // Delegated handler for edit/delete buttons — muestra un formulario inline o borra
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn = e.target.closest('.delete-btn');

    if (delBtn) {
      const id = delBtn.getAttribute('data-id');
      if (!confirm('¿Confirmas borrar esta reserva?')) return;
      try {
        await deleteReservation(id);
        homeController();
      } catch (err) {
        console.error(err);
        alert('Error borrando la reserva');
      }
      return;
    }

    const btn = editBtn;
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const current = reservations.find((r) => String(r.id) === String(id));
    if (!current) return alert('Reserva no encontrada');

    const article = btn.closest('article');
    article.innerHTML = `
      <form class="edit-form p-2 bg-gray-50 rounded" data-id="${id}">
        <input name="workspace" value="${current.workspace}" class="border p-1 w-full mb-1" />
        <input type="date" name="date" value="${current.date}" class="border p-1 w-full mb-1" />
        <div class="flex gap-2 mb-1">
          <input name="startHour" value="${current.startHour}" class="border p-1 w-1/2" />
          <input name="endHour" value="${current.endHour}" class="border p-1 w-1/2" />
        </div>
        <input name="reason" value="${current.reason}" class="border p-1 w-full mb-1" />
        <select name="status" class="border p-1 w-full mb-2">
          <option value="pending" ${current.status === 'pending' ? 'selected' : ''}>pending</option>
          <option value="approved" ${current.status === 'approved' ? 'selected' : ''}>approved</option>
          <option value="cancelled" ${current.status === 'cancelled' ? 'selected' : ''}>cancelled</option>
        </select>
        <div class="flex gap-2">
          <button type="button" class="save-btn bg-blue-600 text-white px-3 py-1 rounded">Guardar</button>
          <button type="button" class="cancel-btn bg-gray-400 text-black px-3 py-1 rounded">Cancelar</button>
        </div>
      </form>
    `;

    // Cancel -> re-render original list
    article.querySelector('.cancel-btn')?.addEventListener('click', () => {
      homeController();
    });

    // Save -> update via API (o sustituir localmente si no hay id)
    article.querySelector('.save-btn')?.addEventListener('click', async () => {
      const form = article.querySelector('.edit-form');
      const updated = {
        ...current,
        workspace: form.workspace.value,
        date: form.date.value,
        startHour: form.startHour.value,
        endHour: form.endHour.value,
        reason: form.reason.value,
        status: form.status.value,
      };

      try {
        if (current.id) {
          await updateReservation(id, updated);
          homeController();
        } else {
          // Sin id: actualizar localmente la tarjeta
          article.innerHTML = ReservationCard(updated);
        }
      } catch (err) {
        console.error(err);
        alert('Error actualizando la reserva');
      }
    });
  });
};
