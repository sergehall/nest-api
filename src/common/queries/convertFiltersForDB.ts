import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertFiltersForDB {
  async prep([...rawFilters]) {
    const searchNameFilters = {
      searchNameTerm: 'name',
      searchLoginTerm: 'login',
      searchEmailTerm: 'email',
    };
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
  async prepForUser([...rawFilters]) {
    const searchNameFilters = {
      searchLoginTerm: 'accountData.login',
      searchEmailTerm: 'accountData.email',
    };
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
