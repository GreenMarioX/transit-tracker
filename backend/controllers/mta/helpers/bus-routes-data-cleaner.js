
function cleanMTARoutesData(rawData, company) {
    const routesList = rawData.response.data.list.route;

    routesData = {
        manhattanReg: [], //route shortName starts with M
        queensReg: [], //route shortName starts with Q
        bronxReg: [], //route shortName starts with Bx
        brooklynReg: [], //route shortName starts with M
        statenislandReg: [], //route shortName starts with S
        xExp: [], //route shortName starts with X
        queensExp: [], //route shortName starts with QM
        bronxExp: [], //route shortName starts with BxM
        brooklynExp: [], //route shortName starts with BM
        statenislandExp: [], //route shortName starts with SIM
        shuttles: [] //others
    }

    for (let i = 0; i < routesList.length; i++) {
        specificRoute = {
            id: routesList[i].id,
            shortName: routesList[i].shortName,
            longName: routesList[i].longName,
            description: routesList[i].description
        }

        if (specificRoute.shortName.startsWith('QM')) {
            routesData.queensExp.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('BxM')) {
            routesData.bronxExp.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('BM')) {
            routesData.brooklynExp.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('SIM')) {
            routesData.statenislandExp.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('M')) {
            routesData.manhattanReg.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('Q')) {
            routesData.queensReg.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('Bx')) {
            routesData.bronxReg.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('B')) {
            routesData.brooklynReg.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('S')) {
            routesData.statenislandReg.push(specificRoute);
        } else if (specificRoute.shortName.startsWith('X')) {
            routesData.xExp.push(specificRoute);
        } else {
            routesData.shuttles.push(specificRoute);
        }
    }

    return routesData

}

module.exports = cleanMTARoutesData