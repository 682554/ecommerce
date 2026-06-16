import queryString from "query-string";

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price_desc"
  | "price_asc";

export type ProductGender = "men" | "women" | "kids" | "unisex";
export type ProductColor =
  | "black"
  | "white"
  | "university-red"
  | "royal-blue"
  | "volt"
  | "orange"
  | "stone"
  | "carbon-grey";
export type ProductSize =
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "one-size";
export type PriceRangeKey =
  | "under-50"
  | "50-100"
  | "100-150"
  | "150-plus";

export type ProductQueryState = {
  search: string;
  category: string[];
  gender: ProductGender[];
  size: ProductSize[];
  color: ProductColor[];
  price: PriceRangeKey[];
  priceMin: number | null;
  priceMax: number | null;
  sort: ProductSortOption;
  page: number;
  limit: number;
};

export type ParsedProductFilters = ProductQueryState;

type QueryInput =
  | string
  | Record<string, string | string[] | undefined>;

type ParsedValue = string | Array<string | null> | null | undefined;

const defaultState: ProductQueryState = {
  search: "",
  category: [],
  gender: [],
  size: [],
  color: [],
  price: [],
  priceMin: null,
  priceMax: null,
  sort: "featured",
  page: 1,
  limit: 9,
};

const allowedSorts: ProductSortOption[] = [
  "featured",
  "newest",
  "price_desc",
  "price_asc",
];

export const genderOptions: Array<{ value: ProductGender; label: string }> = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

export const sizeOptions: Array<{ value: ProductSize; label: string }> = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "one-size", label: "One Size" },
];

export const colorOptions: Array<{
  value: ProductColor;
  label: string;
  swatch: string;
}> = [
  { value: "black", label: "Black", swatch: "#111111" },
  { value: "white", label: "White", swatch: "#f5f5f5" },
  { value: "university-red", label: "University Red", swatch: "#c1121f" },
  { value: "royal-blue", label: "Royal Blue", swatch: "#1d4ed8" },
  { value: "volt", label: "Volt", swatch: "#d9f99d" },
  { value: "orange", label: "Orange", swatch: "#f97316" },
  { value: "stone", label: "Stone", swatch: "#d6d3d1" },
  { value: "carbon-grey", label: "Carbon Grey", swatch: "#6b7280" },
];

export const priceRangeOptions: Array<{
  value: PriceRangeKey;
  label: string;
  min: number;
  max: number | null;
}> = [
  { value: "under-50", label: "Under $50", min: 0, max: 49.99 },
  { value: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { value: "100-150", label: "$100 - $150", min: 100, max: 150 },
  { value: "150-plus", label: "$150 & Above", min: 150, max: null },
];

function normalizeInput(input: QueryInput) {
  if (typeof input === "string") {
    return queryString.parse(input.startsWith("?") ? input : `?${input}`, {
      arrayFormat: "comma",
    });
  }

  const serialized = queryString.stringify(input, {
    arrayFormat: "comma",
    skipEmptyString: true,
    skipNull: true,
  });

  return queryString.parse(serialized, {
    arrayFormat: "comma",
  });
}

function toArray(value: ParsedValue) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: ParsedValue) {
  const raw = Array.isArray(value)
    ? value.find((item): item is string => typeof item === "string")
    : value;

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePageValue(value: ParsedValue) {
  const page = toNumber(value);
  return page && page > 0 ? Math.floor(page) : defaultState.page;
}

function parseLimitValue(value: ParsedValue) {
  const limit = toNumber(value);
  if (!limit || limit <= 0) {
    return defaultState.limit;
  }

  return Math.min(Math.floor(limit), 48);
}

function parseSearchValue(value: ParsedValue) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.trim() : "";
}

function toUniqueValues<T extends string>(values: string[], allowed?: readonly T[]) {
  const normalized = Array.from(new Set(values));

  if (!allowed) {
    return normalized as T[];
  }

  return normalized.filter((value): value is T =>
    allowed.includes(value as T),
  );
}

export function parseProductQuery(input: QueryInput): ProductQueryState {
  const parsed = normalizeInput(input);
  const sortValue = Array.isArray(parsed.sort)
    ? parsed.sort[0]
    : Array.isArray(parsed.sortBy)
      ? parsed.sortBy[0]
      : parsed.sort ?? parsed.sortBy;

  return {
    search: parseSearchValue(parsed.search),
    category: toUniqueValues(toArray(parsed.category)),
    gender: toUniqueValues(
      toArray(parsed.gender),
      genderOptions.map((option) => option.value),
    ),
    size: toUniqueValues(
      toArray(parsed.size),
      sizeOptions.map((option) => option.value),
    ),
    color: toUniqueValues(
      toArray(parsed.color),
      colorOptions.map((option) => option.value),
    ),
    price: toUniqueValues(
      toArray(parsed.price),
      priceRangeOptions.map((option) => option.value),
    ),
    priceMin: toNumber(parsed.priceMin),
    priceMax: toNumber(parsed.priceMax),
    sort: allowedSorts.includes(sortValue as ProductSortOption)
      ? (sortValue as ProductSortOption)
      : defaultState.sort,
    page: parsePageValue(parsed.page),
    limit: parseLimitValue(parsed.limit),
  };
}

export function parseFilterParams(input: QueryInput): ParsedProductFilters {
  return parseProductQuery(input);
}

export function buildProductQueryObject(filters: ParsedProductFilters) {
  const selectedPriceRanges = priceRangeOptions.filter((option) =>
    filters.price.includes(option.value),
  );

  return {
    search: filters.search || undefined,
    categorySlugs: filters.category,
    genderSlugs: filters.gender,
    sizeSlugs: filters.size,
    colorSlugs: filters.color,
    selectedPriceRanges,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sortBy: filters.sort,
    page: filters.page,
    limit: filters.limit,
    offset: (filters.page - 1) * filters.limit,
    preferredColor: filters.color[0] ?? null,
  };
}

export function buildProductQueryString(state: Partial<ProductQueryState>) {
  return queryString.stringify(
    {
      search: state.search?.trim() || undefined,
      category: state.category?.length ? state.category : undefined,
      gender: state.gender?.length ? state.gender : undefined,
      size: state.size?.length ? state.size : undefined,
      color: state.color?.length ? state.color : undefined,
      price: state.price?.length ? state.price : undefined,
      priceMin:
        typeof state.priceMin === "number" ? state.priceMin : undefined,
      priceMax:
        typeof state.priceMax === "number" ? state.priceMax : undefined,
      sort: state.sort && state.sort !== "featured" ? state.sort : undefined,
      page: state.page && state.page > 1 ? state.page : undefined,
      limit:
        state.limit && state.limit !== defaultState.limit
          ? state.limit
          : undefined,
    },
    {
      arrayFormat: "comma",
      skipEmptyString: true,
      skipNull: true,
    },
  );
}

export function buildProductsUrl(
  pathname: string,
  state: Partial<ProductQueryState>,
) {
  return queryString.stringifyUrl(
    {
      url: pathname,
      query: queryString.parse(buildProductQueryString(state), {
        arrayFormat: "comma",
      }),
    },
    {
      arrayFormat: "comma",
      skipEmptyString: true,
      skipNull: true,
    },
  );
}

export function toggleMultiValue(
  state: ProductQueryState,
  key: "category" | "gender" | "size" | "color" | "price",
  value: string,
): ProductQueryState {
  const values = [...state[key]];
  const nextValues = values.includes(value as never)
    ? values.filter((item) => item !== value)
    : [...values, value];

  return {
    ...state,
    [key]: nextValues as ProductQueryState[typeof key],
    page: 1,
  };
}

export function setSortValue(
  state: ProductQueryState,
  sort: ProductSortOption,
): ProductQueryState {
  return {
    ...state,
    sort,
    page: 1,
  };
}

export function clearAllFilters(state: ProductQueryState): ProductQueryState {
  return {
    ...defaultState,
    search: state.search,
    sort: state.sort,
    limit: state.limit,
  };
}

export function removeFilterValue(
  state: ProductQueryState,
  key: "category" | "gender" | "size" | "color" | "price",
  value: string,
): ProductQueryState {
  return {
    ...state,
    [key]: state[key].filter((item) => item !== value),
    page: 1,
  } as ProductQueryState;
}
