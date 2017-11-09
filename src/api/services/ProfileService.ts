import * as Bookshelf from 'bookshelf';
import * as _ from 'lodash';
import { inject, named } from 'inversify';
import { Logger as LoggerType } from '../../core/Logger';
import { Types, Core, Targets } from '../../constants';
import { validate, request } from '../../core/api/Validate';
import { NotFoundException } from '../exceptions/NotFoundException';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { Profile } from '../models/Profile';
import { ProfileCreateRequest } from '../requests/ProfileCreateRequest';
import { ProfileUpdateRequest } from '../requests/ProfileUpdateRequest';
import { RpcRequest } from '../requests/RpcRequest';
import { AddressService } from './AddressService';


export class ProfileService {

    public log: LoggerType;

    constructor(
        @inject(Types.Service) @named(Targets.Service.AddressService) public addressService: AddressService,
        @inject(Types.Repository) @named(Targets.Repository.ProfileRepository) public profileRepo: ProfileRepository,
        @inject(Types.Core) @named(Core.Logger) public Logger: typeof LoggerType
    ) {
        this.log = new Logger(__filename);
    }


    @validate()
    public async rpcFindAll( @request(RpcRequest) data: any): Promise<Bookshelf.Collection<Profile>> {
        return this.findAll();
    }

    public async findAll(withRelated: boolean = true): Promise<Bookshelf.Collection<Profile>> {
        return this.profileRepo.findAll(withRelated);
    }

    @validate()
    public async rpcFindOne( @request(RpcRequest) data: any): Promise<Profile> {
        return this.findOne(data.params[0]);
    }

    public async findOne(id: number, withRelated: boolean = true): Promise<Profile> {
        const profile = await this.profileRepo.findOne(id, withRelated);
        if (profile === null) {
            this.log.warn(`Profile with the id=${id} was not found!`);
            throw new NotFoundException(id);
        }
        return profile;
    }

    @validate()
    public async rpcSaveProfile( @request(RpcRequest) data: any): Promise<Profile> {
        return this.create(data);
    }

    @validate()
    public async create( @request(ProfileCreateRequest) body: any): Promise<Profile> {
        // extract and remove related models from request
        const data = body.params;
        const userAddresses = data.userAddress;
        delete data.userAddress;
        // If the request body was valid we will create the listingItem
        const profile = await this.profileRepo.create(data);

        await this.addressService.saveAddress(profile, userAddresses);

        // // finally find and return the created listingItem
        const newProfile = await this.findOne(profile.Id);
        return newProfile;
    }


    @validate()
    public async rpcUpdate( @request(RpcRequest) data: any): Promise<Profile> {
        return this.update(data.params[0], {
            data: data.params[1] // TODO: convert your params to ProfileUpdateRequest
        });
    }

    @validate()
    public async update(id: number, @request(ProfileUpdateRequest) body: any): Promise<Profile> {

        // find the existing one without related
        const profile = await this.findOne(id, false);
        const updatedProfile = await this.profileRepo.update(id, profile.toJSON());
        return updatedProfile;
    }

    @validate()
    public async rpcDestroy( @request(RpcRequest) data: any): Promise<void> {
        return this.destroy(data.params[0]);
    }

    public async destroy(id: number): Promise<void> {
        await this.profileRepo.destroy(id);
    }

}