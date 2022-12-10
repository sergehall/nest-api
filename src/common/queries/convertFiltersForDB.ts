import { Injectable } from '@nestjs/common';
import { SearchFieldType } from '../../types/types';

const searchFilters = {
  searchNameTerm: 'name',
  searchLoginTerm: 'login',
  searchEmailTerm: 'email',
};

const searchUserFilters = {
  searchLoginTerm: 'accountData.login',
  searchEmailTerm: 'accountData.email',
};

@Injectable()
export class ConvertFiltersForDB {
  async convertAll([...rawFilters]) {
    return this._convert([...rawFilters], searchFilters);
  }
  async convertForUser([...rawFilters]) {
    return this._convert([...rawFilters], searchUserFilters);
  }

  async _convert([...rawFilters], searchFilters: SearchFieldType) {
    const convertedFilters = [];
    for (let i = 0, l = Object.keys(rawFilters).length; i < l; i++) {
      for (const key in rawFilters[i]) {
        if (
          searchFilters.hasOwnProperty(key) &&
          rawFilters[i][key].length !== 0
        ) {
          const convertedFilter = {};
          convertedFilter[searchFilters[key]] = { $regex: rawFilters[i][key] };
          convertedFilters.push(convertedFilter);
        } else {
          convertedFilters.push({});
        }
      }
    }
    return convertedFilters;
  }
}
