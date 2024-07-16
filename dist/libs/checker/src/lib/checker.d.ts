export declare const igor: {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscription: "pro";
    stripeId: string;
    visits: number;
    favouriteColours: string[];
    profile: {
        type: string;
        boughtTracks: number;
    };
    fileSystem: {
        type: string;
        name: string;
        children: ({
            type: string;
            name: string;
            children: {
                type: string;
                name: string;
            }[];
        } | {
            type: string;
            name: string;
            children?: undefined;
        })[];
    };
};
