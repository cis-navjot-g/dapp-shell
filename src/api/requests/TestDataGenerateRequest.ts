import { IsNotEmpty } from 'class-validator';
import { RequestBody } from '../../core/api/RequestBody';

// tslint:disable:variable-name
export class TestDataGenerateRequest extends RequestBody {

    @IsNotEmpty()
    public model: string;

    @IsNotEmpty()
    public amount: number;

    @IsNotEmpty()
    public withRelated: boolean;

}
// tslint:enable:variable-name
