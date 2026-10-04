/* Trippy prototype behavior. jQuery handles selection, events, and DOM updates. */
$(function () {
  const parameters = new URLSearchParams(window.location.search);

  // The GET form performs a simulated search for one documented keyphrase.
  if (document.getElementById("search-results")) {
    const phrase = (parameters.get("q") || "").trim();
    const $results = $("#search-results");
    $("#site-search").val(phrase);
    $("#results-title").text(phrase ? "Search results for " + phrase : "Search results");

    if (phrase.toLowerCase() === "hike") {
      const $list = $('<div class="results-list"></div>');
      $list.append('<a class="card result-card" href="detail.html"><h2>Blue Ridge hike</h2><p>Outdoors · Sat 10:00 AM · $18 per person</p><p>Review details and vote on this Asheville activity.</p></a>');
      $list.append('<a class="card result-card" href="list.html"><h2>More outdoor ideas</h2><p>Browse the Asheville activity proposals for other group plans.</p></a>');
      $results.append($list);
    } else {
      $results.append($('<p class="notice"></p>').text('No results found. Try searching for "hike" to see sample activities.'));
    }
  }

  // Interaction 1: a delegated click handles every RSVP choice in this group.
  const counts = { in: 4, maybe: 1, out: 0 };
  let selectedVote = null;
  $(".vote-group").on("click", ".vote-option", function () {
    const choice = $(this).data("vote");
    const $group = $(this).closest(".vote-group");
    if (selectedVote !== choice) {
      if (selectedVote) counts[selectedVote] -= 1;
      counts[choice] += 1;
      selectedVote = choice;
    }
    $group.find(".vote-option").attr("aria-pressed", "false").addClass("secondary");
    $(this).attr("aria-pressed", "true").removeClass("secondary");
    $group.siblings(".vote-counts").text(counts.in + " in · " + counts.maybe + " maybe · " + counts.out + " out");
    $group.parent().find(".vote-feedback").remove();
    $group.after($('<p class="feedback vote-feedback" role="status"></p>').text("Your response: " + $(this).text().trim() + "."));
  });

  // Interaction 2: changing the category traverses from the select to its list.
  $(".filters #category").on("change", function () {
    const category = $(this).val();
    const $section = $(this).closest(".filters").siblings("section");
    const $cards = $section.find(".activity-card");
    $cards.each(function () {
      const cardCategory = $(this).find(".activity-meta span").first().text();
      $(this).toggleClass("is-hidden", category !== "All categories" && cardCategory !== category);
    });
    const visibleCount = $cards.not(".is-hidden").length;
    $section.find(".section-head > p").text(visibleCount + " ideas currently shown");
    $section.find(".pager > span").first().text("Showing " + visibleCount + " of " + $cards.length + " proposals");
    $section.find(".filter-feedback").remove();
    $section.find(".section-head").after($('<p class="feedback filter-feedback" role="status"></p>').text(visibleCount + " activity ideas shown for " + category.toLowerCase() + "."));
  });

  // Preserve the category when the existing Apply filters form is submitted.
  if (parameters.has("category") && $(".filters #category").length) {
    $(".filters #category").val(parameters.get("category")).trigger("change");
  }
});
