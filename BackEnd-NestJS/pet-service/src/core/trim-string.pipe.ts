import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  constructor(private readonly collapseWhitespace = false) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    return this.trimDeep(value);
  }

  private trimDeep(v: any): any {
    if (typeof v === 'string') {
      let s = v.trim();
      if (this.collapseWhitespace) s = s.replace(/\s+/g, ' ');
      return s;
    }
    if (Array.isArray(v)) return v.map((x) => this.trimDeep(x));
    if (v && typeof v === 'object') {
      const out: any = {};
      for (const [k, val] of Object.entries(v)) out[k] = this.trimDeep(val);
      return out;
    }
    return v;
  }
}
