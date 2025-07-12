import serverFetch from "@/lib/serverFetch"

class HttpService {
  getHealth = async () => {
    const { data } = await serverFetch.get<string>("/health")

    return data == "ok"
  }
}

export const httpService = new HttpService()
