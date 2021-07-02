import {
  ReactElement,
  DetailedHTMLProps,
  SelectHTMLAttributes,
  OptionHTMLAttributes,
  MouseEvent,
  useRef,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import FormGroup from "./FormGroup";
import Accordion from "../../global-scripts/Accordion";
import { IFormControlProps, IFormSelectProps } from "../../../model/model.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";

const checkOptionIsActive = ({
  nativeSelectProps,
  nativeOptionProps,
}: {
  nativeSelectProps: DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
  nativeOptionProps: DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
}): boolean =>
  (nativeSelectProps.defaultValue instanceof Array &&
    nativeSelectProps.defaultValue.includes(String(nativeOptionProps.value))) ||
  (["number", "string"].includes(typeof nativeSelectProps.defaultValue) &&
    String(nativeSelectProps.defaultValue) === String(nativeOptionProps.value));

const FormControlSelect: React.FunctionComponent<
  IFormSelectProps &
    IFormControlProps &
    DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
> = ({
  children,
  label,
  labelExtraClassName,
  isListBoxFixed,
  selectExtraClassName,
  selectPlaceholder,
  maxSelectedOptions,
  useTags = true,
  ...nativeSelectProps
}): ReactElement => {
  const [optionList, setOptionList] =
    useState<Array<DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>>>(
      null
    );
  const [selectedOptionList, setSelectedOptionList] = useState<Array<HTMLOptionElement>>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const selectGroupRef = useRef<HTMLDivElement>(null);

  const selectChangeHandle = () => {
    const selectedOptionList = Array.from(selectRef.current.selectedOptions).filter(
      option => option.value !== ""
    );

    setSelectedOptionList(selectedOptionList);
  };

  const selectListBoxClickHandle = (event: Event): void => {
    if (
      !nativeSelectProps.multiple &&
      (event.currentTarget as HTMLElement).classList.contains("form__select-list-box")
    ) {
      selectGroupRef.current
        ?.querySelector<HTMLElement>(".form__select-toggle")
        .classList.remove("form__select-toggle_active");

      selectGroupRef.current?.querySelector<HTMLElement>("[data-accordion-control]").click();
    }
  };

  const optionClickHandle = (event: MouseEvent<HTMLDivElement>): void => {
    const option = selectRef.current.options[Number(event.currentTarget.dataset.optionIndex)];

    if (
      selectRef.current.selectedOptions.length < (maxSelectedOptions ?? Number.POSITIVE_INFINITY) ||
      option.selected
    ) {
      option.selected = !option.selected;

      event.currentTarget.classList[option.selected ? "add" : "remove"](
        "form__select-option_active"
      );

      if (!nativeSelectProps.multiple) {
        selectGroupRef.current?.querySelectorAll(".form__select-option").forEach(selectOption => {
          if (
            (selectOption as HTMLElement).dataset.optionIndex !==
            event.currentTarget.dataset.optionIndex
          ) {
            selectOption.classList.remove("form__select-option_active");
          }
        });
      }
    }

    nativeSelectProps.onChange &&
      nativeSelectProps.onChange({
        target: selectRef.current,
        currentTarget: selectRef.current,
      } as ChangeEvent<HTMLSelectElement>);
    selectRef.current.dispatchEvent(new Event("change"));
  };

  const tagClickHandle = (event: MouseEvent<HTMLButtonElement>): void => {
    const selectOption = selectGroupRef.current.querySelector<HTMLElement>(
      `.form__select-option[data-option-value="${
        (event.currentTarget.parentNode as HTMLElement).dataset.optionValue
      }"]`
    );

    if (!selectOption) return;

    optionClickHandle({ currentTarget: selectOption } as MouseEvent<HTMLDivElement>);
  };

  const toggleSelectListBox = (event: MouseEvent<HTMLDivElement>): void => {
    if (
      (event.target as HTMLElement).classList.contains("form__select-tag") ||
      (event.target as HTMLElement).classList.contains("form__select-tag-close")
    )
      return;

    selectGroupRef.current
      ?.querySelector<HTMLElement>(".form__select-toggle")
      .classList.toggle("form__select-toggle_active");

    selectGroupRef.current?.querySelector<HTMLElement>("[data-accordion-control]").click();
  };

  const closeSelectListBox = (event: Event): void => {
    if (!selectGroupRef.current?.contains(event.target as HTMLElement)) {
      const selectHiddenControl = selectGroupRef.current?.querySelector<HTMLElement>(
        `[class*="accordion__control_active"]`
      );

      if (selectHiddenControl) {
        selectGroupRef.current
          ?.querySelector<HTMLElement>(".form__select-toggle")
          .classList.toggle("form__select-toggle_active");

        selectHiddenControl.click();
      }
    }
  };

  useEffect(() => {
    selectRef.current?.addEventListener("change", selectChangeHandle);

    return () => selectRef.current?.removeEventListener("change", selectChangeHandle);
  }, [selectRef.current]);

  useEffect(() => {
    selectRef.current?.addEventListener("click", selectChangeHandle);
    selectRef.current?.addEventListener("change", selectChangeHandle);

    return () => selectRef.current?.removeEventListener("change", selectChangeHandle);
  }, []);

  useEffect(() => {
    if (!(children instanceof Array)) return;

    const hasHierarchy = children.some(option => !!option["data-parent"]);

    if (hasHierarchy) {
      const sortedOptionList = new Map();

      (children as Array<HTMLOptionElement>).forEach(option => {
        !option["data-parent"] && sortedOptionList.set(option.value, [option]);
      });

      sortedOptionList.set("__parentNotFound", []);

      (children as Array<HTMLOptionElement>).forEach(option => {
        if (option["data-parent"]) {
          const parentOption = sortedOptionList.get(option["data-parent"]);

          if (parentOption) {
            sortedOptionList.set(option["data-parent"], [...parentOption, option]);
          } else {
            const notFoundOption = sortedOptionList.get("__parentNotFound");

            sortedOptionList.set("__parentNotFound", [...notFoundOption, option]);
          }
        }
      });

      setOptionList(Array.from(sortedOptionList.values()).flat());
    } else {
      setOptionList(
        children as Array<
          DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>
        >
      );
    }
  }, [children]);

  useEffect(() => {
    if (!(optionList instanceof Array)) return;

    setSelectedOptionList(
      (
        optionList as Array<
          DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>
        >
      )?.reduce((selectedOptionList, nativeOptionProps) => {
        if (!checkOptionIsActive({ nativeSelectProps, nativeOptionProps }))
          return selectedOptionList;

        const option = document.createElement("option");

        Object.assign(option, { ...nativeOptionProps, selected: true });

        selectedOptionList.push(option);

        return selectedOptionList;
      }, [])
    );
  }, [optionList]);

  useEffect(() => {
    document.addEventListener("click", closeSelectListBox, true);
    selectGroupRef.current
      ?.querySelector(".form__select-list-box")
      .addEventListener("click", selectListBoxClickHandle, true);

    return () => {
      document.removeEventListener("click", closeSelectListBox);
      selectGroupRef.current
        ?.querySelector(".form__select-list-box")
        .removeEventListener("click", selectListBoxClickHandle);
    };
  }, [selectGroupRef.current]);

  return (
    <FormGroup {...{ label, labelExtraClassName, required: nativeSelectProps.required }}>
      <select style={{ display: "none" }} {...nativeSelectProps} ref={selectRef}>
        <option value="" label="" />
        {(
          optionList as Array<
            DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>
          >
        )?.map((nativeOptionProps, i) => (
          <option
            key={`FormControlSelectOption-${i}`}
            {...nativeOptionProps}
            selected={checkOptionIsActive({ nativeSelectProps, nativeOptionProps })}
          />
        ))}
      </select>
      {(optionList && (
        <Accordion>
          <div ref={selectGroupRef} data-accordion-item className="form__select-group">
            <div
              data-accordion-title
              className={`form__select-control ${selectExtraClassName ?? ""}`.trim()}
              onClick={toggleSelectListBox}
            >
              {selectedOptionList?.map(option => {
                if (useTags) {
                  return (
                    <div
                      key={`FormSelectTag-${option.value}`}
                      className="form__select-tag"
                      data-option-value={option.value}
                    >
                      {option.label}
                      <button
                        className="form__select-tag-close"
                        type="button"
                        onClick={tagClickHandle}
                      />
                    </div>
                  );
                }

                return option.label;
              })}
              {selectPlaceholder && (
                <div
                  className={`form__select-placeholder ${
                    selectedOptionList?.length ? "" : "form__select-placeholder_active"
                  }`.trim()}
                >
                  {selectPlaceholder}
                </div>
              )}
              <button className="form__select-toggle form__select-toggle_small" type="button" />
            </div>
            <div className="form__select-list-wrapper" data-accordion-content>
              <div
                className={convertObjectToClassName({
                  "form__select-list-box": true,
                  "form__select-list-box_fixed-horizontally": Boolean(isListBoxFixed),
                })}
              >
                {(
                  optionList as Array<
                    DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>
                  >
                ).map((nativeOptionProps, i) => {
                  return (
                    <div
                      key={`FormControlQuasiSelectOption-${i}`}
                      className={`form__select-option ${
                        checkOptionIsActive({ nativeSelectProps, nativeOptionProps })
                          ? "form__select-option_active"
                          : ""
                      } ${
                        nativeOptionProps["data-parent"] ? "form__select-option_child" : ""
                      }`.trim()}
                      data-option-index={i + 1}
                      data-option-value={nativeOptionProps.value}
                      onClick={optionClickHandle}
                    >
                      {nativeOptionProps.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div data-accordion-control />
          </div>
        </Accordion>
      )) || (
        <div className="form__select-group">
          <div className="form__select-control form__select-control_small form__control_full-width">
            {selectPlaceholder && (
              <span className="form__select-placeholder">{selectPlaceholder}</span>
            )}
            <button className="form__select-toggle form__select-toggle_small" type="button" />
          </div>
        </div>
      )}
    </FormGroup>
  );
};

export default FormControlSelect;
