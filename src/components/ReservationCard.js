export default function ReservationCard(reservation) {
  const { id, workspace, date, startHour, endHour, reason, status } = reservation;
  return `
    <article
      class="rounded"
    >
      <h3 class="font-bold text-lg">
        ${workspace}
      </h3>

      <div class="">

        <p>
          Fecha:
          ${date}
        </p>

        <p>
          Horario:
          ${startHour}
          -
          ${endHour}
        </p>

        <p>
          Motivo:
          ${reason}
        </p>

        <p>
          Estado:
          <span class="">
            ${status}
          </span>
        </p>

        <div class="mt-3 flex gap-2">
          <button data-id="${id}" class="edit-btn bg-yellow-400 text-black px-3 py-1 rounded">Editar</button>
          <button data-id="${id}" class="delete-btn bg-red-500 text-white px-3 py-1 rounded">Borrar</button>
        </div>

      </div>
    </article>
  `;
}
