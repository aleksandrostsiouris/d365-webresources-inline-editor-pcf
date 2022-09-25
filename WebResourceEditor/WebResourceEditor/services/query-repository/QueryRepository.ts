export class QueryRepository<T> implements IQueryRepository<T> {
    private readonly _xrm: ComponentFramework.WebApi;
    private static entityType: string;
    private static filter: string | undefined;
    private static select: string;
    private static id: string;
    private static data: ComponentFramework.WebApi.Entity;
    constructor(webApi: ComponentFramework.WebApi) {
        this._xrm = webApi;
    }

    public BuildQuery(entityType: string, filter?: string | undefined): this {
        QueryRepository.entityType = entityType;
        QueryRepository.filter = filter;
        QueryRepository.select =
            "&$select=displayname, webresourcetype, content, contentjson, webresourceid, name, webresourceidunique, modifiedon, createdon";
        return this;
    }

    public async Get() {
        const res = await this._xrm.retrieveMultipleRecords(
            QueryRepository.entityType,
            QueryRepository.filter + QueryRepository.select);

        if (res.entities.length > 0) {
            return res.entities as T[];
        }
        return null;
    }

    public BuildRepository(entityType: string, id: string, data: ComponentFramework.WebApi.Entity): this {
        QueryRepository.entityType = entityType;
        QueryRepository.id = id;
        QueryRepository.data = data;
        return this;
    }

    public async Patch() {
        const result = await this._xrm.updateRecord(
            QueryRepository.entityType,
            QueryRepository.id,
            QueryRepository.data
        );
        if (result) return;
        throw new Error(`The webresource with id ${QueryRepository.id} couldn't be updated`);
    }
}

export interface IQueryRepository<T> {
    BuildQuery(entityType: string, filter?: string | undefined): this;
    Get(): Promise<Nullable<T[]>>;
    BuildRepository(entityType: string, id: string, data: ComponentFramework.WebApi.Entity): this
    Patch(): Promise<void>;
}

export type Nullable<T> = T | null | undefined;