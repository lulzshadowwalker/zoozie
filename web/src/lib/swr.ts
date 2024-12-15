"use client";

//  NOTE: This is a workaround build errors when importing api.ts which imports useSWR saying `module swr has no default export useSWR`

import swr from "swr";

const useSWR = swr

export default useSWR