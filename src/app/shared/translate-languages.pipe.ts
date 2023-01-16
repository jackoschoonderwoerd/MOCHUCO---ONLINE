import { UpperCasePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'translate' })
export class TranslateLanguagesPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return value;
        }
        switch (value) {
            case 'dutch':
                return 'nederlands';
            case 'german':
                return 'deutsch';
            case 'spanish':
                return 'español';
            case 'french':
                return 'francais';
            case 'italian':
                return 'italiano';
            default:
                return value
        }
    }
}
