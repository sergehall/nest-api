import { Injectable } from '@nestjs/common';

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

  async _convert([...rawFilters], searchFilters) {
    const convertedFilters = [];
    for (let i = 0, l = Object.keys(rawFilters).length; i < l; i++) {
      for (const key in rawFilters[i]) {
        if (rawFilters[i].hasOwnProperty(key)) {
          const newFilter = {};
          newFilter[searchFilters[key]] = { $regex: rawFilters[i][key] };
          convertedFilters.push(newFilter);
        } else {
          convertedFilters.push({});
        }
      }
    }
    return convertedFilters;
  }
}
