import { RpcRequest } from '../requests/RpcRequest';
import { Command } from './Command';
import { CommandEnumType } from './CommandEnumType';
import { RpcCommandFactory } from '../factories/RpcCommandFactory';

export interface RpcCommandInterface<T> {

    commands: CommandEnumType;
    command: Command;

    execute(data: RpcRequest, rpcCommandFactory: RpcCommandFactory = undefined): Promise<T>;
    getName(): string;
    getCommand(): Command;
    getChildCommands(): Command[];
    help(): string;
    example(): any;
    description(): string;
}
