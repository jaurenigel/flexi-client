export default function({ $axios, redirect }) {
  $axios.onError(error => {
    if (error.response.status === 404) {
      // localStorage.removeItem("auth._token.local");
      redirect("/auth/login");
    }
  });
}
