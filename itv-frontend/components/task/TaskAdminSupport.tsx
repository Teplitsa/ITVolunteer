import { ReactElement, useState, useRef, createRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import {
  IFetchResult,
} from "../../model/model.typing";
import * as utils from "../../utilities/utilities"
import * as _ from "lodash"

const TaskAdminSupport: React.FunctionComponent = (): ReactElement => {
  const nonceContactForm = useStoreState(store => store.components.task.nonceContactForm)
  const [isContactFormVisible, setContactFormVisibility] = useState(false)
  const [isMessageSent, setMessageSent] = useState(false)
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
  })
  const contactForm = createRef<HTMLFormElement>()
  const inputName = createRef<HTMLInputElement>()
  const inputEmail = createRef<HTMLInputElement>()
  const inputMessage = createRef<HTMLTextAreaElement>()

  const submitContactForm = () => {
    if(!process.browser) {
      return;
    }

    let name = _.get(inputName.current, "value", "")
    let email = _.get(inputEmail.current, "value", "")
    let message = _.get(inputMessage.current, "value", "")

    setFormErrors({
      ...formErrors, 
      name: !name, 
      email: !email, 
      message: !message
    })

    if(!name || !email || !message) {
      return
    }

    var page_url;
    try {
      page_url = window.location.href;
    } catch(ex){}

    let formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)
    formData.append('page_url', page_url)
    formData.append('nonce', nonceContactForm)

    let action = 'add-message'
    fetch(utils.getAjaxUrl(action), {
        method: 'post',
        body: formData,
    })
    .then(res => {
        try {
            return res.json()
        } catch(ex) {
            utils.showAjaxError({action, error: ex})
            return {}
        }
    })
    .then(
        (result: IFetchResult) => {
            if(result.status == 'fail') {
                return utils.showAjaxError({message: result.message})
            }

            setContactFormVisibility(false)
            setMessageSent(true)
        },
        (error) => {
            utils.showAjaxError({action, error})
        }
    )
  }

  return (
    <div className="something-wrong-with-task">
      {!isContactFormVisible && !isMessageSent &&
      <a href="#" className="contact-admin" onClick={(e) => {
        e.preventDefault();
        setMessageSent(false)
        setContactFormVisibility(true)
      }}>
        Что-то не так с задачей? Напиши администратору
      </a>
      }

      {isMessageSent &&
      <div className="contact-admin">Сообщение отправлено</div>
      }

      {isContactFormVisible &&
      <div className="contact-form">
        <form ref={contactForm} onSubmit={(e) => {
          e.preventDefault();
        }}>

          <div className="form-group">
            <input ref={inputName} type="text" className={`form-control input-sm ${formErrors.name ? "error" : ""}`} name="name" placeholder="Ваше имя" />
          </div>

          <div className="form-group">
            <input ref={inputEmail} type="text" className={`form-control input-sm ${formErrors.email ? "error" : ""}`} name="email" placeholder="Email" />
          </div>

          <div className="form-group">
            <label>Ваше сообщение:</label>
            <textarea ref={inputMessage} className={`form-control input-sm ${formErrors.message ? "error" : ""}`} name="message"></textarea>
          </div>

          <div className="action-block">
            <a className="primary-button" href="#" onClick={(e) => {
              e.preventDefault();
              submitContactForm()
            }}>Отправить</a>

            <a className="secondary-button" href="#" onClick={(e) => {
              e.preventDefault();
              setContactFormVisibility(false)
            }}>Отменить</a>
          </div>

        </form>

        <div id="result-message" className="alert alert-info contact-form-result"></div>

      </div>
      }
    </div>
  );
};

export default TaskAdminSupport;
