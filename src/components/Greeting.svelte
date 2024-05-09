<script lang="ts">
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting = "";

    if (currentHour < 1) {
        greeting = "Happy midnight 🌕";
    } else if (currentHour < 5) {
        greeting = "Sleep time!!! 🕒";
    } else if (currentHour < 12) {
        greeting = "Good morning ☀️";
    } else if (currentHour < 18) {
        greeting = "Good afternoon 🌤️";
    } else {
        greeting = "Good evening 🌙";
    }
</script>

<h1 class="md:text-3xl text-xl font-bold text-white py-4">{greeting}</h1>
