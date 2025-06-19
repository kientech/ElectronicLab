// Category filter
if (selectedCategory !== "all") {
  filtered = filtered.filter(
    (project) => project.category === selectedCategory
  );
}

// Status filter
if (selectedStatus !== "all") {
  filtered = filtered.filter((project) => project.status === selectedStatus);
}
