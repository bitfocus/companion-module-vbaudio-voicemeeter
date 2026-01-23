import { CompanionHTTPRequest, CompanionHTTPResponse } from '@companion-module/base'
import VoicemeeterInstance from './index'

interface Endpoints {
  GET: {
    [endpoint: string]: () => void
  }

  [method: string]: {
    [endpoint: string]: () => void
  }
}

/**
 * @param instance Voicemeeter Instance
 * @param request HTTP request
 * @returns HTTP response
 * @description Checks incoming HTTP requests to the instance for an appropriate handler or returns a 404
 */
export const httpHandler = async (
  instance: VoicemeeterInstance,
  request: CompanionHTTPRequest
): Promise<CompanionHTTPResponse> => {
  const response: CompanionHTTPResponse = {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 404, message: 'Not Found' }),
  }

	const getData = () => {
    response.status = 200
    response.body = JSON.stringify(instance.data, null, 2)
	}

  const getVariables = () => {
    const data = instance.variables?.currentVariables || {}

    response.status = 200
    response.body = JSON.stringify(data, null, 2)
  }

  const endpoints: Endpoints = {
    GET: {
			data: getData,
      variables: getVariables,
    },
    POST: {},
  }

  const endpoint = request.path.replace('/', '').toLowerCase()

  if (endpoints[request.method][endpoint]) endpoints[request.method][endpoint]()

  return response
}
