import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppService} from './app.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DnsCheckService {
  private backendUrl: string;
  private clientInfo: object;
  private _profiles: string[];

  constructor(private http: HttpClient,
    private translateService: TranslateService,
    appService: AppService) {

    this.backendUrl = appService.getConfig('apiEndpoint');
    this.clientInfo = appService.getClientInfo();

    if (!this.backendUrl) {
      this.translateService.get('Please set the api endpoint').subscribe((res: string) => {
        console.error(res);
      });
    }
  }

  private RPCRequest(method, params = {}, guiInfo = true) {
    const id = Date.now();

    if (guiInfo) {
      params['client_version'] = this.clientInfo['version'];
      params['client_id'] = this.clientInfo['id'];
    }

    const data = {
      'jsonrpc': '2.0',
      id,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.backendUrl, data)
        .subscribe(res => {
          if ('result' in res) {
            resolve(res['result']);
          } else {
            console.error(res);
            reject(res);
          }
        }, (err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  // API Implementation from https://github.com/zonemaster/zonemaster-backend/blob/master/docs/API.md
  public versionInfo() {
    return this.RPCRequest('version_info', {}, false);
  }

  public profileNames() {
    return this.RPCRequest('profile_names', {}, false);
  }

  public startDomainTest(data) {
    return this.RPCRequest('start_domain_test', {
      language: this.translateService.currentLang,
      ...data
    });
  }

  public testProgress(testId) {
    return this.RPCRequest('test_progress', {'test_id': testId}, false);
  }

  public getTestResults(data) {
    return this.RPCRequest('get_test_results', data, false);
  }

  public getTestHistory(data, offset = 0, limit = 100, filter = 'all') {
    const domain = data["domain"];
    return this.RPCRequest('get_test_history', {
      offset,
      limit,
      filter,
      'frontend_params': {domain}}, false);
  }

  public fetchFromParent(domain) {
    return this.RPCRequest('get_data_from_parent_zone', {
      language: this.translateService.currentLang,
      domain: domain
    }, false);
  }

  public getProfileNames(): string[] {
    console.log('getProfiles')
    return this._profiles;
  }

  public setProfileNames(profiles: string[]): void {
    console.log('setProfil')
    this._profiles = profiles;
  }
}
