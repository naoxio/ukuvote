import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <main>
        <h1>Welcome to Ukuvota</h1>
        <p>Empower your decision-making process with our innovative voting platform</p>
        <Link href="/start" class="cta-button">Get Started</Link>
        <section class="features">
          <div class="feature">
            <h2>Collaborative</h2>
            <p>Work together to reach consensus</p>
          </div>
          <div class="feature">
            <h2>Transparent</h2>
            <p>Clear and open voting process</p>
          </div>
          <div class="feature">
            <h2>Efficient</h2>
            <p>Quick and easy decision-making</p>
          </div>
        </section>
      </main>
    </>
  );
});

export const head: DocumentHead = {
  title: "Ukuvota - Collaborative Decision Making",
  meta: [
    {
      name: "description",
      content: "Ukuvota is a powerful platform for collaborative decision-making and voting processes.",
    },
  ],
};