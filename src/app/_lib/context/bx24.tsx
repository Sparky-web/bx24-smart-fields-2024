import { B24Frame } from "@bitrix24/b24jssdk";
import { createContext, useContext, useEffect, useState } from "react";
import ChildrenInterface from "~/types/children-interface";

import { env } from '~/env';
// import * as bx from "@bitrix24/b24jssdk"

const bx = await import('~/lib/bx24-localhost-3000')

const {
    initializeB24Frame,
} = bx

export const BX24Context = createContext({} as B24Frame)

export const BX24Provider = (props: ChildrenInterface) => {
    const [bx24, setBx24] = useState<B24Frame | null>(null)

    useEffect(() => {
        initializeB24Frame()
            .then((response: B24Frame) => {
                setBx24(response)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    if (!bx24) return 'Загрузка...'

    return <BX24Context.Provider value={bx24}>
        {bx24 && props.children}
    </BX24Context.Provider>
}

export const useBitrix = () => useContext(BX24Context)