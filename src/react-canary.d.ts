// El App Router de Next usa la versión canary de React, que exporta
// `ViewTransition`. Los tipos de esa exportación viven en `react/canary`
// y hay que referenciarlos una vez para que `import { ViewTransition }
// from "react"` compile.
/// <reference types="react/canary" />
