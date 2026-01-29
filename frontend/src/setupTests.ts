import "@testing-library/jest-dom"
import {expect,afterEach,vi} from 'vitest'
import {cleanup} from "@testing-library/react"
import { Global } from "recharts";


afterEach(() =>{
    cleanup();
})


// Mock window matchMedia
Object.defineProperty(window, "matchMedia",{
    writable:true,
    value:vi.fn().mockImplementation(query =>({
        matches:true,
        media:query,
        onchange:null,
        addListener:vi.fn(),
        removeListener:vi.fn(),
        addEventListener:vi.fn(),
        removeEventListener:vi.fn(),
        dispatchEvent:vi.fn()
    }))
})

globalThis.IntersectionObserver =class IntersectionObserver{
    constructor(){}
    disconnect(){}
    observe(){}
    takeRecords(){
        return [];
    }
    unobserve(){}

} as any;

const localStorageMock={
    getItem:vi.fn(),
    setItem:vi.fn(),
    removeItem:vi.fn(),
    clear:vi.fn(),
};
globalThis.localStorage = localStorageMock as any