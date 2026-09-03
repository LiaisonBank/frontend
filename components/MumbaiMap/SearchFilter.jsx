// SearchFilter.jsx
"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  Typography,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  ClickAwayListener,
  Fade,
  CircularProgress,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import BuildIcon from "@mui/icons-material/Build";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./SearchFilter.scss";

// ============================================================
// STYLED COMPONENTS
// ============================================================

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "$isExpanded",
})(({ theme, $isExpanded }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  width: $isExpanded ? "100%" : "40px",
  "& .MuiOutlinedInput-root": {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: $isExpanded ? "8.5px 14px" : "8.5px 4px",
    "& fieldset": {
      borderColor: $isExpanded ? "#e5e7eb" : "transparent",
      transition: "border-color 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: $isExpanded ? "#d1d5db" : "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e55a00",
    },
    "& .MuiInputAdornment-root": {
      margin: 0,
    },
  },
  "& .MuiInputBase-input": {
    opacity: $isExpanded ? 1 : 0,
    width: $isExpanded ? "100%" : 0,
    padding: $isExpanded ? "8.5px 0" : "8.5px 0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::placeholder": {
      opacity: $isExpanded ? 1 : 0,
      transition: "opacity 0.2s ease",
    },
  },
}));

const FilterBadge = styled(Typography)(({ theme }) => ({
  color: "#f36421",
  fontWeight: 600,
  backgroundColor: "#fef3ed",
  padding: "2px 12px",
  borderRadius: "12px",
  fontSize: "0.7rem",
  whiteSpace: "nowrap",
}));

const ClearAllChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#f3f4f6",
  color: "#374151",
  height: "22px",
  fontSize: "0.7rem",
  "& .MuiChip-label": {
    padding: "0 8px",
    fontSize: "0.65rem",
  },
  "& .MuiChip-deleteIcon": {
    fontSize: "14px",
    marginRight: "4px",
  },
  "&:hover": {
    backgroundColor: "#e5e7eb",
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  flexWrap: "wrap",
  "@media (min-width: 600px)": {
    flexWrap: "nowrap",
  },
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  flex: "0 0 auto",
  width: "40px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&.expanded": {
    flex: "1 1 auto",
    minWidth: "200px",
    width: "100%",
  },
  "@media (min-width: 600px)": {
    "&.expanded": {
      minWidth: "300px",
      maxWidth: "500px",
    },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  flex: "1 1 auto",
  minWidth: "200px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
  "@media (min-width: 600px)": {
    flex: "1 1 0",
    minWidth: "150px",
  },
}));

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const formatCategory = (value) => {
  try {
    if (!value) return [];
    if (typeof value === "string") {
      return String(value)
        .replace(/[\[\]"\\]/g, "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    return [];
  } catch (error) {
    console.warn("Error formatting category:", error);
    return [];
  }
};

const normalizeText = (value) => {
  try {
    if (!value && value !== 0) return "";
    return String(value).toLowerCase().trim().replace(/\s+/g, " ");
  } catch (error) {
    console.warn("Error normalizing text:", error);
    return "";
  }
};

const matchesSearch = (project, searchTerm) => {
  try {
    if (!project || typeof project !== "object") return false;
    if (!searchTerm || typeof searchTerm !== "string") return true;

    const term = normalizeText(searchTerm);
    if (!term) return true;

    const searchFields = [
      project.client_name,
      project.location,
      project.projectsCategory,
      project.category,
      project.project_status,
      project.name,
      project.title,
    ];

    return searchFields.some((field) => {
      if (field === undefined || field === null) return false;
      const normalizedField = normalizeText(String(field));
      return normalizedField.includes(term);
    });
  } catch (error) {
    console.warn("Error in matchesSearch:", error);
    return false;
  }
};

const isValidProject = (project) => {
  return project && typeof project === "object" && project.id !== undefined;
};

const getStatusColor = (status) => {
  try {
    if (!status) return "#6b7280";
    const colors = {
      Completed: "#FF6B00",
      "In Progress": "#FFB700",
      Upcoming: "#f59e0b",
      "Under Construction": "#e55a00",
      "Design Phase": "#8b5cf6",
      Planning: "#10b981",
      "On Hold": "#ef4444",
      Cancelled: "#6b7280",
    };
    return colors[status] || "#6b7280";
  } catch (error) {
    return "#6b7280";
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SearchFilter({
  projects = [],
  onFilterChange,
  selectedProject = null,
  onSelectProject = null,
  isLoading = false,
  placeholder = "Search projects by name, location, category...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    services: [],
    statuses: [],
  });
  const [error, setError] = useState(null);
  const [popperWidth, setPopperWidth] = useState("100%");
  const [selectedProjectData, setSelectedProjectData] = useState(null);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const anchorRef = useRef(null);
  const prevProjectsRef = useRef([]);
  const isInitialMount = useRef(true);
  const suggestionClickRef = useRef(false);
  // Update popper width when anchor changes
  useEffect(() => {
    if (anchorRef.current) {
      setPopperWidth(anchorRef.current.clientWidth || "100%");
    }
  }, [anchorRef.current?.clientWidth, isExpanded]);

  // Validate projects prop
  const validProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      setError(new Error("Projects prop must be an array"));
      return [];
    }
    const filtered = projects.filter(isValidProject);
    if (filtered.length !== projects.length) {
      setError(
        new Error("Some projects are invalid and have been filtered out"),
      );
    } else {
      setError(null);
    }
    return filtered;
  }, [projects]);

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    try {
      const categories = new Set();
      const services = new Set();
      const statuses = new Set();

      validProjects.forEach((project) => {
        try {
          const projectCategories = formatCategory(project.projectsCategory);
          projectCategories.forEach((cat) => {
            if (cat && typeof cat === "string") categories.add(cat);
          });

          const projectServices = formatCategory(project.category);
          projectServices.forEach((service) => {
            if (service && typeof service === "string") services.add(service);
          });

          if (
            project.project_status &&
            typeof project.project_status === "string"
          ) {
            statuses.add(project.project_status);
          }
        } catch (err) {
          console.warn("Error processing project for filters:", err);
        }
      });

      return {
        categories: Array.from(categories).sort(),
        services: Array.from(services).sort(),
        statuses: Array.from(statuses).sort(),
      };
    } catch (error) {
      console.error("Error extracting filter options:", error);
      return { categories: [], services: [], statuses: [] };
    }
  }, [validProjects]);

  // Get filtered results based on current filters and search term
  const getFilteredResults = useCallback(() => {
    try {
      let result = validProjects;

      // Apply search term filter
      if (searchTerm && typeof searchTerm === "string") {
        result = result.filter((project) => matchesSearch(project, searchTerm));
      }

      // Apply category filter
      if (activeFilters.categories.length > 0) {
        result = result.filter((project) => {
          try {
            const projectCategories = formatCategory(project.projectsCategory);
            return activeFilters.categories.some((filter) =>
              projectCategories.some(
                (cat) => cat && normalizeText(cat) === normalizeText(filter),
              ),
            );
          } catch (err) {
            console.warn("Error in category filter:", err);
            return false;
          }
        });
      }

      // Apply service filter
      if (activeFilters.services.length > 0) {
        result = result.filter((project) => {
          try {
            const projectServices = formatCategory(project.category);
            return activeFilters.services.some((filter) =>
              projectServices.some(
                (service) =>
                  service && normalizeText(service) === normalizeText(filter),
              ),
            );
          } catch (err) {
            console.warn("Error in service filter:", err);
            return false;
          }
        });
      }

      // Apply status filter
      if (activeFilters.statuses.length > 0) {
        result = result.filter((project) => {
          try {
            return activeFilters.statuses.some(
              (status) =>
                status &&
                normalizeText(project.project_status || "") ===
                  normalizeText(status),
            );
          } catch (err) {
            console.warn("Error in status filter:", err);
            return false;
          }
        });
      }

      return result;
    } catch (error) {
      console.error("Error filtering results:", error);
      return validProjects;
    }
  }, [validProjects, searchTerm, activeFilters]);

  // Update suggestions based on search term
  const updateSuggestions = useCallback(
    (results) => {
      try {
        if (
          searchTerm &&
          typeof searchTerm === "string" &&
          searchTerm.trim().length > 0
        ) {
          const matches = results.filter((p) => matchesSearch(p, searchTerm));
          setSuggestions(matches.slice(0, 8));
          setIsOpen(matches.length > 0);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch (error) {
        console.warn("Error updating suggestions:", error);
        setSuggestions([]);
        setIsOpen(false);
      }
    },
    [searchTerm],
  );

  // Apply filters and update parent
  const applyFilters = useCallback(
    (results) => {
      try {
        const resultsStr = JSON.stringify(results);
        const prevStr = JSON.stringify(prevProjectsRef.current);

        if (resultsStr !== prevStr) {
          prevProjectsRef.current = results;
          if (onFilterChange && typeof onFilterChange === "function") {
            onFilterChange(results);
          }
          updateSuggestions(results);
        }
      } catch (error) {
        console.error("Error applying filters:", error);
        if (onFilterChange && typeof onFilterChange === "function") {
          onFilterChange([]);
        }
      }
    },
    [onFilterChange, updateSuggestions],
  );

  // Effect to handle filter changes
  useEffect(() => {
    try {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        if (validProjects.length > 0) {
          prevProjectsRef.current = validProjects;
          if (onFilterChange && typeof onFilterChange === "function") {
            onFilterChange(validProjects);
          }
        }
        return;
      }

      const results = getFilteredResults();
      applyFilters(results);
    } catch (error) {
      console.error("Error in filter effect:", error);
    }
  }, [getFilteredResults, applyFilters, validProjects, onFilterChange]);

  // Add this useEffect to handle click outside the entire search area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchPanelOpen(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    try {
      const value = event?.target?.value || "";
      setSearchTerm(value);

      // Clear selected project when user types
      if (selectedProjectData) {
        setSelectedProjectData(null);
        if (onSelectProject && typeof onSelectProject === "function") {
          onSelectProject(null);
        }
      }

      if (!value || value.trim().length === 0) {
        setIsOpen(false);
        setSuggestions([]);
      }
    } catch (error) {
      console.warn("Error handling search change:", error);
    }
  };

  // Handle suggestion click
 // Handle suggestion click
const handleSuggestionClick = (project) => {
  try {
    if (!project || typeof project !== "object") {
      console.warn("Invalid project selected");
      return;
    }

    // Get display name
    const displayName =
      project.client_name ||
      project.location ||
      project.name ||
      project.title ||
      "";

    // Set search term
    setSearchTerm(displayName);

    // CRITICAL: Close suggestions dropdown immediately
    setIsOpen(false);
    setSuggestions([]);

    // Clear any selected project data
    setSelectedProjectData(project);

    // CLOSE SEARCH PANEL
    setIsSearchPanelOpen(false);
    setIsExpanded(false); // This will collapse the search input

    // Callback to parent
    if (onSelectProject && typeof onSelectProject === "function") {
      onSelectProject(project);
    }

    // Remove focus from input
    if (inputRef.current && typeof inputRef.current.blur === "function") {
      inputRef.current.blur();
    }

    // Force close the popper by updating anchor element
    if (anchorRef.current) {
      // This triggers a re-render of the popper
      setPopperWidth(anchorRef.current.clientWidth || "100%");
    }
  } catch (error) {
    console.error("Error handling suggestion click:", error);
  }
};

  // Clear search
  const handleClearSearch = () => {
    try {
      setSearchTerm("");
      setIsOpen(false);
      setSuggestions([]);
      setSelectedProjectData(null);
      setIsExpanded(false);
      if (onSelectProject && typeof onSelectProject === "function") {
        onSelectProject(null);
      }
      if (inputRef.current && typeof inputRef.current.focus === "function") {
        inputRef.current.focus();
      }
    } catch (error) {
      console.warn("Error clearing search:", error);
    }
  };

  // Toggle search expansion
  const handleToggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        if (inputRef.current && typeof inputRef.current.focus === "function") {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // Toggle filter - UPDATED: Closes filter panel on selection
  const toggleFilter = (type, value) => {
    try {
      if (!type || !value) return;

      let isAdding = false;

      setActiveFilters((prev) => {
        const current = prev[type] || [];
        const index = current.findIndex(
          (item) => item && normalizeText(item) === normalizeText(value),
        );

        let newFilters;
        if (index > -1) {
          newFilters = current.filter((_, i) => i !== index);
          isAdding = false;
        } else {
          newFilters = [...current, value];
          isAdding = true;
        }

        return { ...prev, [type]: newFilters };
      });

      // Auto-close filter panel when adding a filter
      if (isAdding) {
        setShowFilters(false);
      }

      setSelectedProjectData(null);
      if (onSelectProject && typeof onSelectProject === "function") {
        onSelectProject(null);
      }
    } catch (error) {
      console.warn("Error toggling filter:", error);
    }
  };

  // Check if a filter is active
  const isFilterActive = (type, value) => {
    try {
      if (!type || !value) return false;
      const filters = activeFilters[type];
      if (!Array.isArray(filters)) return false;
      return filters.some(
        (item) => item && normalizeText(item) === normalizeText(value),
      );
    } catch (error) {
      console.warn("Error checking filter status:", error);
      return false;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    try {
      setActiveFilters({
        categories: [],
        services: [],
        statuses: [],
      });
      setSearchTerm("");
      setSuggestions([]);
      setIsOpen(false);
      setSelectedProjectData(null);
      setIsExpanded(false);
      setIsSearchPanelOpen(false); // Close the panel
      setShowFilters(false);
      setError(null);
      if (onSelectProject && typeof onSelectProject === "function") {
        onSelectProject(null);
      }
    } catch (error) {
      console.warn("Error clearing filters:", error);
    }
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    try {
      return (
        (activeFilters.categories?.length || 0) +
        (activeFilters.services?.length || 0) +
        (activeFilters.statuses?.length || 0)
      );
    } catch (error) {
      return 0;
    }
  }, [activeFilters]);

  // Handle click outside for filter panel
  const handleFilterClickAway = () => {
    setShowFilters(false);
  };

  // Handle click outside for suggestions
  const handleSuggestionsClickAway = () => {
    setIsOpen(false);
  };

  // Handle focus
  const handleFocus = () => {
    try {
      if (
        searchTerm &&
        searchTerm.trim().length > 0 &&
        suggestions.length > 0
      ) {
        setIsOpen(true);
      }
    } catch (error) {
      console.warn("Error handling focus:", error);
    }
  };

  // Get current filtered projects for display
  const currentFilteredProjects = useMemo(() => {
    try {
      return getFilteredResults();
    } catch (error) {
      console.warn("Error getting filtered projects:", error);
      return [];
    }
  }, [getFilteredResults]);

  const hasActiveFilters = useMemo(() => {
    try {
      return !!(searchTerm || activeFilterCount > 0);
    } catch (error) {
      return false;
    }
  }, [searchTerm, activeFilterCount]);

  // Render error state if needed
  if (error && validProjects.length === 0) {
    return (
      <div className="search-filter-container" ref={searchRef}>
        <Box
          sx={{
            p: 2,
            bgcolor: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          <Typography sx={{ color: "#dc2626" }}>
            Error:{" "}
            {error.message || "Something went wrong with the search filter."}
          </Typography>
        </Box>
      </div>
    );
  }

  const inputSlotProps = {
    startAdornment: (
      <InputAdornment position="start" sx={{ ml: isExpanded ? 0 : 0.5 }}>
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <SearchIcon
            sx={{
              color: isExpanded ? "#9ca3af" : "#6b7280",
              cursor: "pointer",
              transition: "color 0.3s ease",
            }}
            onClick={handleToggleSearch}
          />
        )}
      </InputAdornment>
    ),
    endAdornment:
      isExpanded && searchTerm ? (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={handleClearSearch}
            aria-label="clear search"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </InputAdornment>
      ) : null,
  };

  return (
    <div className="search-filter-container" ref={searchRef}>
      <SearchContainer className="align-items-start d-flex flex-column">
        {/* Filter Section */}
        <FilterSection className="filter-chips-wrapper">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              cursor: "pointer",
              flexWrap: "wrap",
              gap: 0.5,
            }}
            className="filter-bar"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Typography
              variant="caption"
              sx={{ color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}
            >
              Filters
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {activeFilterCount > 0 && (
                <FilterBadge>
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                  active
                </FilterBadge>
              )}

              {hasActiveFilters && (
                <ClearAllChip
                  label="Clear all"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllFilters();
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    clearAllFilters();
                  }}
                  deleteIcon={<ClearIcon />}
                />
              )}

              <IconButton
                size="small"
                sx={{
                  color: "#6b7280",
                  p: 0.5,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilters(!showFilters);
                }}
                aria-label="toggle filters"
              >
                {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Filter Content with ClickAwayListener */}
          {showFilters && (
            // <ClickAwayListener
            //   onClickAway={() => {
            //     setShowFilters(false);
            //     setIsSearchPanelOpen(false); // Also close search panel
            //   }}
            // >
            <ClickAwayListener
              onClickAway={(event) => {
                // Check if the click was on a suggestion item or its children
                const target = event.target;
                const isSuggestionClick = target.closest && target.closest('.MuiListItemButton-root');
                
                // Only close if not clicking on a suggestion
                if (!isSuggestionClick) {
                  setIsOpen(false);
                }
              }}
            >
              <Box className="filters-content" sx={{ width: "100%", mt: 1 }}>
                {/* Category Filters */}
                {filterOptions.categories.length > 0 && (
                  <Box className="filter-group" sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", fontWeight: 500 }}
                      >
                        Categories
                      </Typography>
                    </Box>
                    <Box
                      className="category-type"
                      sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                    >
                      {filterOptions.categories.map((category) => {
                        const isActive = isFilterActive("categories", category);
                        return (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            variant={isActive ? "filled" : "outlined"}
                            onClick={() => toggleFilter("categories", category)}
                            sx={{
                              backgroundColor: isActive
                                ? "#f36421"
                                : "transparent",
                              color: isActive ? "#ffffff" : "#374151",
                              borderColor: isActive ? "#f36421" : "#d1d5db",
                              "&:hover": {
                                backgroundColor: isActive
                                  ? "#f36421"
                                  : "#f3f4f6",
                                opacity: isActive ? 0.8 : 1,
                              },
                              fontSize: "0.75rem",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Service Filters */}
                {filterOptions.services.length > 0 && (
                  <Box className="filter-group" sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <BuildIcon fontSize="small" sx={{ color: "#6b7280" }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", fontWeight: 500 }}
                      >
                        Services
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {filterOptions.services.map((service) => {
                        const isActive = isFilterActive("services", service);
                        return (
                          <Chip
                            key={service}
                            label={service}
                            size="small"
                            variant={isActive ? "filled" : "outlined"}
                            onClick={() => toggleFilter("services", service)}
                            sx={{
                              backgroundColor: isActive
                                ? "#8b5cf6"
                                : "transparent",
                              color: isActive ? "#ffffff" : "#374151",
                              borderColor: isActive ? "#8b5cf6" : "#d1d5db",
                              "&:hover": {
                                backgroundColor: isActive
                                  ? "#7c3aed"
                                  : "#f3f4f6",
                                opacity: isActive ? 0.8 : 1,
                              },
                              fontSize: "0.75rem",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Status Filters */}
                {filterOptions.statuses.length > 0 && (
                  <Box className="filter-group" sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", fontWeight: 500 }}
                      >
                        Status
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {filterOptions.statuses.map((status) => {
                        const isActive = isFilterActive("statuses", status);
                        const statusColor = getStatusColor(status);
                        return (
                          <Chip
                            key={status}
                            label={status}
                            size="small"
                            variant={isActive ? "filled" : "outlined"}
                            onClick={() => toggleFilter("statuses", status)}
                            sx={{
                              backgroundColor: isActive
                                ? statusColor
                                : "transparent",
                              color: isActive ? "#ffffff" : "#374151",
                              borderColor: isActive ? statusColor : "#d1d5db",
                              "&:hover": {
                                backgroundColor: isActive
                                  ? statusColor
                                  : "#f3f4f6",
                                opacity: isActive ? 0.8 : 1,
                              },
                              fontSize: "0.75rem",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          )}
        </FilterSection>

        <SearchWrapper className={isExpanded ? "expanded" : ""} ref={anchorRef}>
          <StyledTextField
            ref={inputRef}
            fullWidth
            size="small"
            placeholder={isExpanded ? placeholder : ""}
            value={searchTerm || ""}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            disabled={isLoading || false}
            className="projectsearch"
            $isExpanded={isExpanded}
            slotProps={{
              input: {
                startAdornment: inputSlotProps.startAdornment,
                endAdornment: inputSlotProps.endAdornment,
                onBlur: () => {
                  // Keep the input expanded if there's a value
                  if (!searchTerm) {
                    setIsExpanded(false);
                  }
                },
              },
              htmlInput: {
                "aria-label": "Search projects",
              },
            }}
          />

          {/* Suggestions Popper */}
         {/* Suggestions Popper */}
<Popper
  open={Boolean(isOpen && suggestions.length > 0 && searchTerm.trim().length > 0)}
  anchorEl={anchorRef.current}
  placement="bottom-start"
  transition
  sx={{
    
    width: popperWidth,
    zIndex: 1300,
    marginTop: "4px",
  }}
>
  {({ TransitionProps }) => (
    <ClickAwayListener
      onClickAway={(event) => {
        // Don't close if we're in the middle of a suggestion click
        if (suggestionClickRef.current) {
          return;
        }
        
        // Check if click is on a suggestion item
        const target = event.target;
        const isSuggestionItem = target.closest && target.closest('.MuiListItemButton-root');
        
        if (!isSuggestionItem) {
          setIsOpen(false);
        }
      }}
    >
      <Fade {...TransitionProps} timeout={200}>
        <Paper
          elevation={3}
          sx={{
            maxHeight: "300px",
            overflow: "auto",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <List dense>
            {Array.isArray(suggestions) && suggestions.length > 0 ? (
              suggestions.map((project) => (
                <ListItemButton
                  key={project?.id || Math.random().toString()}
                  onClick={() => {
                    suggestionClickRef.current = true;
                    handleSuggestionClick(project);
                    // Reset the ref after a short delay
                    setTimeout(() => {
                      suggestionClickRef.current = false;
                    }, 100);
                  }}
                  selected={selectedProject?.id === project?.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#e5e7eb",
                    },
                    width: "100%",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "32px" }}>
                    <LocationOnIcon
                      fontSize="small"
                      sx={{ color: "#6b7280" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      project?.client_name ||
                      project?.location ||
                      project?.name ||
                      project?.title ||
                      "Unnamed Project"
                    }
                    secondary={
                      <Box
                        component="span"
                        sx={{ display: "flex", gap: "8px", mt: 0.5 }}
                      >
                        {project?.location && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#6b7280" }}
                          >
                            📍 {project.location}
                          </Typography>
                        )}
                        {project?.project_status && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: getStatusColor(
                                project.project_status,
                              ),
                              fontWeight: 500,
                            }}
                          >
                            ● {project.project_status}
                          </Typography>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{
                      component: "div",
                    }}
                  />
                </ListItemButton>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No matching projects found" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Fade>
    </ClickAwayListener>
  )}
</Popper>
        </SearchWrapper>
      </SearchContainer>

      {/* Selected Project Card */}
      {selectedProjectData && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {selectedProjectData.client_name ||
                selectedProjectData.name ||
                selectedProjectData.title ||
                "Unnamed Project"}
            </Typography>
            {selectedProjectData.location && (
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", display: "block" }}
              >
                📍 {selectedProjectData.location}
              </Typography>
            )}
            {selectedProjectData.project_status && (
              <Typography
                variant="caption"
                sx={{
                  color: getStatusColor(selectedProjectData.project_status),
                  fontWeight: 500,
                  display: "block",
                }}
              >
                ● {selectedProjectData.project_status}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedProjectData(null);
              setSearchTerm("");
              setIsExpanded(false);
              if (onSelectProject && typeof onSelectProject === "function") {
                onSelectProject(null);
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </div>
  );
}
