export const calculatePlotStats = (plots = []) => {
    const stats = {
        total: {
            count: 0,
            area: 0,
        },

        rent: {
            count: 0,
            area: 0,
        },

        own: {
            count: 0,
            area: 0,
        },

        krok: {
            count: 0,
            area: 0,
        },

        lada: {
            count: 0,
            area: 0,
        },

        noGeometry: {
            count: 0,
            area: 0,
        },
    };

    plots.forEach((plot) => {
        const area = Number(plot.plot?.area || 0);

        stats.total.count++;
        stats.total.area += area;

        if (plot.ownershipType === "rent") {
            stats.rent.count++;
            stats.rent.area += area;
        }

        if (plot.ownershipType === "own") {
            stats.own.count++;
            stats.own.area += area;
        }

        if (plot.source === "КРОК") {
            stats.krok.count++;
            stats.krok.area += area;
        }

        if (plot.source === "ЛАДА") {
            stats.lada.count++;
            stats.lada.area += area;
        }

        const hasGeometry =
            plot.geometry?.type &&
            Array.isArray(plot.geometry?.coordinates) &&
            plot.geometry.coordinates.length > 0;

        if (!hasGeometry) {
            stats.noGeometry.count++;
            stats.noGeometry.area += area;
        }
    });

    return stats;
};