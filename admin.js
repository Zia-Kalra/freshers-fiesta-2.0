const loginScreen =
  document.getElementById("login-screen");

const dashboard =
  document.getElementById("dashboard");

const loginForm =
  document.getElementById("login-form");

const loginError =
  document.getElementById("login-error");

const registrationsBody =
  document.getElementById("registrations-body");

const totalCount =
  document.getElementById("total-count");

const logoutButton =
  document.getElementById("logout-button");

const refreshButton =
  document.getElementById("refresh-button");


/* =========================
   CHECK EXISTING SESSION
========================= */

async function checkSession() {

  try {

    const response =
      await fetch("/api/admin/session");

    const data =
      await response.json();

    if (data.authenticated) {
      showDashboard();
    }

  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );
  }
}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    loginError.textContent = "";

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    try {

      const response =
        await fetch("/api/admin/login", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            username,
            password
          })

        });

      const data =
        await response.json();

      if (!response.ok) {

        loginError.textContent =
          data.error ||
          "Login failed.";

        return;
      }

      showDashboard();

    } catch (error) {

      console.error(error);

      loginError.textContent =
        "Unable to connect to server.";
    }
  }
);


/* =========================
   SHOW DASHBOARD
========================= */

function showDashboard() {

  loginScreen.classList.add("hidden");

  dashboard.classList.remove("hidden");

  loadRegistrations();
}


/* =========================
   LOAD REGISTRATIONS
========================= */

async function loadRegistrations() {

  registrationsBody.innerHTML = `
    <tr>
      <td colspan="9" class="loading">
        LOADING REGISTRATIONS...
      </td>
    </tr>
  `;

  try {

    const response =
      await fetch(
        "/api/admin/registrations"
      );

    if (response.status === 401) {

      dashboard.classList.add("hidden");

      loginScreen.classList.remove("hidden");

      loginError.textContent =
        "Session expired. Please login again.";

      return;
    }

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Failed to load registrations."
      );
    }

    totalCount.textContent =
      data.count;

    renderRegistrations(
      data.registrations
    );

  } catch (error) {

    console.error(error);

    registrationsBody.innerHTML = `
      <tr>
        <td colspan="9" class="loading">
          ERROR LOADING REGISTRATIONS
        </td>
      </tr>
    `;
  }
}


/* =========================
   RENDER TABLE
========================= */

function renderRegistrations(
  registrations
) {

  if (
    !registrations ||
    registrations.length === 0
  ) {

    registrationsBody.innerHTML = `
      <tr>
        <td colspan="9" class="loading">
          NO REGISTRATIONS YET
        </td>
      </tr>
    `;

    return;
  }

  registrationsBody.innerHTML =
    registrations
      .map((registration, index) => {

        const createdAt =
          registration.createdAt
            ? new Date(
                registration.createdAt
              ).toLocaleString("en-IN")
            : "-";

        return `
          <tr>

            <td>
              ${index + 1}
            </td>

            <td>
              ${escapeHtml(
                registration.name
              )}
            </td>

            <td>
              ${escapeHtml(
                registration.email
              )}
            </td>

            <td>
              ${escapeHtml(
                registration.phone
              )}
            </td>

            <td>
              ${escapeHtml(
                registration.enrollment
              )}
            </td>

            <td>
              ${escapeHtml(
                registration.year
              )}
            </td>

            <td>
              ${escapeHtml(
                registration.course
              )}
            </td>

            <td>
              ${escapeHtml(
                registration.specialization
              )}
            </td>

            <td>
              ${escapeHtml(
                createdAt
              )}
            </td>

          </tr>
        `;

      })
      .join("");
}


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   REFRESH
========================= */

refreshButton.addEventListener(
  "click",
  loadRegistrations
);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
  "click",
  async () => {

    try {

      await fetch(
        "/api/admin/logout",
        {
          method: "POST"
        }
      );

    } catch (error) {

      console.error(error);

    }

    dashboard.classList.add("hidden");

    loginScreen.classList.remove("hidden");

    loginForm.reset();

    loginError.textContent = "";
  }
);


/* =========================
   START
========================= */

checkSession();