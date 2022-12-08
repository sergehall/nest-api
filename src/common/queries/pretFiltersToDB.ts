import { Injectable } from '@nestjs/common';

const searchNameFilters = {
  searchNameTerm: 'name',
  searchLoginTerm: 'login',
  searchEmailTerm: 'email',
};

@Injectable()
export class CreateFiltersForDB {
  async prep([...rawFilters]) {
    const convertedFilters = [];
    for (let i = 0, l = Object.keys(rawFilters).length; i < l; i++) {
      for (const key in rawFilters[i]) {
        if (key in searchNameFilters) {
          const newFilter = {};
          newFilter[searchNameFilters[key]] = { $regex: rawFilters[i][key] };
          convertedFilters.push(newFilter);
        } else {
          convertedFilters.push({});
        }
      }
    }
    return convertedFilters;
  }
}
